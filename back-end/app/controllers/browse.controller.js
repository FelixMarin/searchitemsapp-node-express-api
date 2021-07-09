var scrapper = require('scrapper');
const Company = require('../models/company.model.js');
const request = require('request');
const Puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const htmlparser2 = require("htmlparser2");
const Cheerio = require('cheerio');

process.setMaxListeners(Infinity);
Puppeteer.use(StealthPlugin());
Puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

exports.scrapperGet = async (req, res) => {

    res.setHeader('Content-Type', 'application/json'); 
    const company = await getCompany(req.params.companyname);
    const url = urlComposser(company.url, req.params.product);    

    scrapper.get(url, async ($) => {  
        res.send(await getDocument($, company, url, req.params.product));
    }, {text: ''}, headers());   
};

exports.scrapeBrowser = async (req, res) => { 
  res.setHeader('Content-Type', 'application/json'); 
  res.send(await getDocumentBrowser(req));
};

exports.scrapperPostMercadona = async (req, res) => {
  res.setHeader('Content-Type', 'application/json'); 
  const company = await getCompany(req.params.companyname);
  const url = company.url; 
  const uri = url.match(/^http[s]?:\/\/.*?\//)[0];
  uri === null ? '':uri;  
  const posts = [];

  const body = {
    params: 'query=' + req.params.product + '&clickAnalytics=true'
  }

 await request({
        headers: {
            'content-type' : 'application/x-www-form-urlencoded'},
            'User-Agent' : 'Mozilla/5.0',
            'Accept-Language' : 'es-ES,es;q=0.8',  
            'Accept-Encoding' : 'gzip, deflate, sdch',
            'referer': 'https://www.google.com/',
            'Accept': 'application/json',
        uri: url,
        body: JSON.stringify(body),
        method: 'POST'
      }, (error, response, body) => {

          const bodyparsed = JSON.parse(body);
          const hits = bodyparsed.hits;

          for (let index = 0; index < hits.length; index++) {

            const element = hits[index];
            let obj = {
              identificador: getProductId(company, index),
              name: company.name,
              description: company.description,
              category: company.category,
              country:company.country,
              image: element.thumbnail,
              product: element.display_name,
              unit_price: element.price_instructions.bulk_price + '€', 
              reference_price: element.price_instructions.reference_price + '€/Kg',
              image_alt: '',
              url: urlComposser(company.url, req.params.product),
              link: uri + element.share_url,
              offer_price: false,
              data: ''
          };
            posts[index] = obj;                     
          }
    
          const resp = sortProducts(posts.filter(elem => elem.product.toUpperCase().includes(req.params.product.toUpperCase())));
          res.send(resp);
      });
  };

//const functions

const getDocumentBrowser = async (req) => {
  
  const company = await getCompany(req.params.companyname);
  const url = company.url; 

  const browser = await Puppeteer.launch({
    //executablePath: './node_modules/puppeteer/.local-chromium/linux-884014/chrome-linux/chrome',
    headless: true,
    args: ['--no-sandbox','--headless']
  });

  const page = await browser.newPage();

  // Throws TimeoutError when headless is set to true
  try{
      page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

      await page.setUserAgent('Mozilla/5.0');
      await page.setExtraHTTPHeaders({ referer: 'https://www.google.com/' });
      await page.setCacheEnabled(false);
      await page.setDefaultNavigationTimeout(30000);      
      await page.goto(urlComposser(url, req.params.product),  { waitUntil: 'networkidle2' }); 
            
      await page.evaluate(() => document.body.innerHTML);      
      await page.evaluate(() => window.scrollTo(0,window.document.body.scrollHeight));

     
  } catch (e) {
      console.log(e);
  }

  const uri = page.url().match(/^http[s]?:\/\/.*?\//)[0];
  uri === null ? '':uri;
  const data = await page.content();
 
  await browser.close();   
  return await processList(company, req.params.product, data, uri);
};

const processList = (company, product, data, uri) => {

  const posts = [];

      const dom = htmlparser2.parseDocument(data);      
      const $ = Cheerio.load(dom);
     
      let attrProduct = selectorProces(company.product);
      let attrUPrice = selectorProces(company.unit_price);
      let attrRPrice = selectorProces(company.reference_price);
      let attrImageAlt = selectorProces(company.image_alt);
      let attrLink = selectorProces(company.link);
      let attrImage = selectorProces(company.image);
      
      $(company.content).each(async (index, array) => {
        
        let obj = {
          identificador: getProductId(company, index),
          name: company.name,
          description: company.description,
          category: company.category,
          country:company.country,
          image: getImage($(array), company.image, attrImage),
          product: contentExtractor($(array), company.product, attrProduct),
          unit_price: getUnitPrice($(array), company, attrUPrice),
          reference_price: contentExtractor($(array), company.reference_price, attrRPrice),
          image_alt: contentExtractor($(array), company.image_alt, attrImageAlt),
          url: urlComposser(company.url, product),
          link: contentExtractor($(array), company.link, attrLink) === undefined ? uri : uri + contentExtractor($(array), company.link, attrLink),
          offer_price: contentExtractor($(array), company.offer_price, ''),
          data: $(array).attr('data-json')
      };

      if(obj.unit_price.length && obj.reference_price.length) {
        posts[index] = obj; 
      }
      });  

  return sortProducts(posts.filter(elem => elem.product.toUpperCase().includes(product.toUpperCase())));
};

const getDocument = async ($, company, url, product) => {

  const posts = []; 
  const uri = url.match(/^http[s]?:\/\/.*?\//)[0];
  uri === null ? '':uri;  

  let attrProduct = selectorProces(company.product);
  let attrUPrice = selectorProces(company.unit_price);
  let attrRPrice = selectorProces(company.reference_price);
  let attrImageAlt = selectorProces(company.image_alt);
  let attrLink = selectorProces(company.link);
  let attrImage = selectorProces(company.image);

  $(company.content).each((index, array) => {
        
    let obj = {
      identificador: getProductId(company, index),
      name: company.name,
      description: company.description,
      category: company.category,
      country:company.country,
      image: getImage($(array), company.image, attrImage),
      product: contentExtractor($(array), company.product, attrProduct),
      unit_price: getUnitPrice($(array), company, attrUPrice),
      reference_price: getReferencePrice(contentExtractor($(array), company.reference_price, attrRPrice)),
      image_alt: contentExtractor($(array), company.image_alt, attrImageAlt),
      url: urlComposser(company.url, product),
      link: contentExtractor($(array), company.link, attrLink) === undefined ? uri : uri + contentExtractor($(array), company.link, attrLink),
      offer_price: getUnitPrice($(array), company.offer_price, ''),
      data: $(array).attr('data-json')
    }

    if(obj.unit_price.length && obj.reference_price.length) {
      posts[index] = obj; 
    }
  });

const postsFiltered = posts.filter(
    elem => elem.product.toUpperCase().includes(product.toUpperCase()));

  return await sortProducts(postsFiltered);
};

const getCompany = async (companyname) => {
    const companies = await Company.find({name: companyname}); 
    return companies[0];
}

const selectorProces = (inSelector) => {
    let res;
  
    if(inSelector) {
      let selector = inSelector.split('|');
      if(selector.length == 2) {
          res = {
              selector: selector[0],
              attribute: selector[1]
          };
      }
    }
    return res?res:'';
};

const getReferencePrice = (string) => {

  let regex = /.*\(([^)]*)/
  let hasParenthesis = string.includes('(') && string.includes(')');
  let result = '';

  if(hasParenthesis) {
    let match = string.match(regex);
    result = match ? match[1] : string;
  } else {
    result = string;
  }
return result;
};

const sortProducts = (posts) => {
    return posts.sort((a, b) => (a.unit_price > b.unit_price) ? 1 : -1);
};

const urlComposser = (url, product) => {
    return url.replace(/{[1]}/gi, product);
};

const getImage = (array, image, attrib) => {
    let imagePath = contentExtractor(array, image, attrib);
    return imagePath === undefined ? 'https://s3-eu-west-1.amazonaws.com/carritus.com/images_pms_thumbnails/62/35043562_thumbnail.jpg' : imagePath;
};

const getUnitPrice = (array, company, attr) => {

    const regex = /\s([\$€¥₹]\d+([\.,]\d{2}?))|(\d+([\.,]\d{2}?)[\$€¥₹])\s?/;
    let offer = contentExtractor(array, company.offer_price, '');
    let unit = contentExtractor(array, company.unit_price, attr);

    if(offer) {
      offer = offer.trim().includes("€")? offer : (offer + '€');
      offer = offer.trim().replace(/\s/g, '');
      offer = offer ? offer : '';
      let price = offer.match(regex);
      offer = price ? price[0] : '';
    }

    if(unit) {
      unit = unit.trim().includes("€")?unit : (unit + '€');
      unit = unit.replace(/\s/g, '');
      let price = unit.match(regex);
      unit = price ? price[0] : '';
    }

    return offer == '' ? unit : offer;
  };

  const contentExtractor = (array, selector, attrib) => {
    return attrib == '' ? array.find(selector).text() : array.find(attrib.selector).attr(attrib.attribute);
};

const getProductId = (company, index) => {
  return company.name.trim().replace(/\s/g, '').substring(0,3) + (index + 1);
};

const fileWrite = (data) => {
    fs.writeFile('log.txt', data, function (err,dat) {
      if (err) {
        return console.log(err,dat);
      }
      console.log(data);
    });
 };

 const getHtml = (content, selectorGlobal) => {
    scrapper.html(content, function($){
        return $(selectorGlobal).text();
    });
};

const headers = () => {
    return {
        'User-Agent': 'Googlebot',  
        'content-type' : 'application/x-www-form-urlencoded',   
        'referer': 'https://www.google.com/',
        'Accept-Language' : 'es-ES,es;q=0.8',  
        'Accept-Encoding' : 'gzip, deflate, sdch',
        'Accept': 'application/json'
    }
};