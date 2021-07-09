$(window).resize(resize());
$(window).on('resize', function() {
    resize();
});

jQuery(document).ready(function ($) {

   /* if(window.localStorage.getItem('sia_token')  == null) {
        alert('Please, insert a valid login.');
        window.localStorage.clear();
        window.location.href = '/login';
    }*/

    $('#botonAceptar').bind('click', function() {
        enviar();
      });

    $('#botonBarra').bind('click', function() {
        enviar();
      });

    $('#inputtext').bind('keyup', function(e) {
        
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#botonAceptar').click();
            $('#sugerencias').html('');
            $('#sugerencias').css("display", "none");
            $('#botonBarra').focus();
            return;
        } else {
            desplazarbarra();
        }

        liveSearch(this.value);
      });
    
    $('#logout').bind('click',function() {
        localStorage.clear();
        window.location.href="/login";
      });      

      $('#body').bind('click', function() {
        $('#sugerencias').css("display", "none");
      });

    $("img.imglogo").imgCheckbox();
    
    return this;
});

const setNewClass = function(selector, atributo) {
    $(selector).removeAttr('class');
    $(selector).attr('class', '');
    $(selector)[0].className = atributo;
}

const desplazarbarra = function() {
    let input = $('#inputtext');

    if(input.value != '') { 
        $('#logo').css("display", "none");  

        setNewClass('#colinput', 'col-12');
        $('#input-container').addClass('desplazar');
        $("#tablalogos").removeClass('hidden').addClass('show');
        $("#radiogroup").removeClass('hidden').addClass('show');
        $("#label-ordenar-por").removeClass('hidden').addClass('show');
        $("#button-aceptar").removeClass('hidden').addClass('show');
        $("#separdor-footer").removeClass('hidden').addClass('show');

        let sizescreen = window.screen.availWidth;

        if(sizescreen <= 1023) {
            $('#contenedor-input-productos').addClass('separacion-input-productos-sm');
        }
    } else {
        $('#sugerencias').html('');
    }
}


const enviar = () => {
    $('#cajamensajes').css("display", "none");
    let elemProducto = $('#inputtext');
    let elemEmpresas = $('.imgChked');
    let elemOrdenarDown = $('[name="sizeBy"]');
    let valOrdenar = 1;
    let valProducto = '';
    let valEmpresas = '';

    $('#productos').html('');
    $('#caja-logos-checked').html('');

    if(elemProducto.val() != '') {
        valProducto = encodeURIComponent(elemProducto.val());
    } else {
        $('#sugerencias').html('');
        return;
    }
    
    let marcas = elemEmpresas;

    if(elemEmpresas.length != 0) {

        $('#logout').css("display", "none");

        for (let item of elemEmpresas) {
            let didEmpresa = item.firstChild.alt;
            let sizescreen = window.screen.availWidth;
            let imgLogo;

            if(sizescreen > 1023) {
                imgLogo = imagenLogoEmpresa(didEmpresa).replace('w-50','w-100');
            } else {
                imgLogo = imagenLogoEmpresa(didEmpresa).replace('w-50','');
            }

            let logoEmpresa = document.createRange().createContextualFragment(imgLogo);
            logoEmpresa.children[0].classList.add('cardinal');
            logoEmpresa.children[0].classList.remove('climg');
            logoEmpresa.children[0].classList.remove('pt-2');
            logoEmpresa.children[0].classList.remove('pl-2');
            logoEmpresa.children[0].classList.remove('pb-2');

            let div = document.createElement("div");
            div.classList.add('mt-3');
            div.classList.add('border');
            div.classList.add('col-lg-1');
            div.classList.add('col-md-2');
            div.classList.add('col-sm-3');
            div.classList.add('col-xs-3');
            div.classList.add('mobile-size');
            div.classList.add('logos-busqueda');
            div.appendChild(logoEmpresa);
            $('#caja-logos-checked').append(div);
            valEmpresas += didEmpresa + ',';
        }

        let divrow = document.createElement('div');
        let divcols = document.createElement('div');
        divrow.appendChild(divcols);

        divrow.classList.add('row');
        divrow.classList.add('mt-3');
        divrow.classList.remove('col-4');
        divrow.id = 'group-selector';

        let posicion = elemEmpresas.length === 12 ? 8 :(12 - elemEmpresas.length - 3);
        divrow.classList.add('offset-lg-' + posicion);
        
        divcols.classList.add('col-lg-12','col-md-2','col-sm-3','col-xs-3');
        
        let selectGroup = document.createElement("select");

        selectGroup.addEventListener('change',function(elem) {
            let opcion = elem.target.value;
            if(opcion == 1) {               
                elemOrdenarDown[0].checked = true;
            } else {
                elemOrdenarDown[1].checked = true;
            }
        }, false);

        selectGroup.setAttribute('id','select-top');
        selectGroup.setAttribute("class", "form-control");
        selectGroup.style.border = "solid 1px #ddd";
        selectGroup.classList.add('float-right'); 
        selectGroup.setAttribute('onchange','enviar();return false;');

        let opcionPrecio = document.createElement("option");
        opcionPrecio.text = 'Precio';
        opcionPrecio.setAttribute('value','1');
        opcionPrecio.setAttribute('id','precio');

        let opcionVolumen = document.createElement("option");
        opcionVolumen.text = 'Precio/Kilo';
        opcionVolumen.setAttribute('value','2');
        opcionVolumen.setAttribute('id','volumen');
        
        if(elemOrdenarDown[0].checked) {
            opcionPrecio.selected = "true";
        } else {
            opcionVolumen.selected = "true";
        }

        selectGroup.appendChild(opcionPrecio);
        selectGroup.appendChild(opcionVolumen);
        divcols.appendChild(selectGroup);
        
        $('#caja-logos-checked').append(divrow);

        let div = document.createElement("div");
        div.classList.add('col-1');
        div.classList.add('mt-3');

        let buttonVolver = document.createElement("a");
        buttonVolver.setAttribute("href", "/main");
        buttonVolver.setAttribute("id", "boton-volver");
        buttonVolver.innerHTML = "Volver";
        buttonVolver.classList.add('btn');
        buttonVolver.classList.add('btn-outline-secondary');
        buttonVolver.style.border = "solid 1px #ddd";
        buttonVolver.classList.add('ml-5');
        buttonVolver.classList.add('float-right'); 

        div.appendChild(buttonVolver);
        $('#caja-logos-checked').append(div);

        buttonVolver.addEventListener('click', function() {
            $('#logout').css("display", "block");
        });
        
        valEmpresas = valEmpresas.substr(0,valEmpresas.length - 1);  
    } else {
        return;
    }

    if(elemOrdenarDown[1].checked) {
        valOrdenar = 2;
    }

    traerProductos(valProducto, valOrdenar, valEmpresas);
}

const traerProductos = (producto, ordenar, strEmpresas) => {
    
    let regex = /\d+(?:\,\d+)?/;
    let counter = 1;
    let d = new Date();

    let bufferProducts = [];
    strEmpresas.split(',').forEach((elem) => {
        
        $.ajax({
            type: "GET",
            url:  getUrlService(elem, producto),
            dataType: "text",
            timeout: 1000000,
            beforeSend: () => {                    
                    $('#inputtext').prop( "disabled", true);
                    $('#botonBarra').prop( "disabled", true);
                    $('#sugerencias').html('');
                    $('#sugerencias').addClass('hidden');
                    $('#cajamensajes').css("display","none");
                    $('#productos').addClass("hidden");
                    $("#rowempresas").css("display", "none");
                    $("#separdor-footer").css("display", "none");
                    $("#radiogroupid").css("display", "none");
                    $("#colinput").css("margin-top", "1%");
                    $('#input-container').removeClass("containerCL");
                    $("#input-container").addClass("mt-2");                    
                    $('#ruleta').removeClass('hidden');
                    $('#ruleta').addClass('show');                    
            }
            }).done((data) => {      
                $('.progress').css('width', (counter * 100) / strEmpresas.split(',').length + '%');
                $('.sr-only').addClass('show');    
                $('.sr-only').text((counter * 100) / strEmpresas.split(',').length + '% Complete');
                $('#inputtext').removeClass("error");
                $('#text-wait').text('Escaneados: ' + counter + ' de ' + strEmpresas.split(',').length + ' supermercados.');

                if(counter >= strEmpresas.split(',').length) {
                    $('#text-wait').text('Loading...');
                    $('.sr-only').text('');
                    $('.progress').css('width', '0px');
                    $('#ruleta').addClass('hidden');
                    $('#ruleta').removeClass('show');
                }

                $('#productos').removeClass("hidden");
                $('#productos').addClass("show");
                $('#inputtext').prop( "disabled", false);
                $('#botonBarra').prop( "disabled", false);
                window.localStorage.setItem(producto + '|' + ordenar + '|' + strEmpresas, data);

                if(Object.is(data,window.localStorage.getItem('data'))) {
                    return;
                } else {
                    bufferProducts = bufferProducts.concat(JSON.parse(data));

                    bufferProducts = bufferProducts
                    .filter(elem => elem != null)
                    .filter(elem => elem.unit_price != undefined)
                    .filter(elem => elem.reference_price != undefined);
                    
                    bufferProducts.forEach(elem => {
                        if(elem.name === 'MERCADONA') {
                            elem.unit_price = elem.unit_price.replace('.', ',');
                            elem.reference_price = elem.reference_price.replace('.', ',');
                        }
                    });

                    if(ordenar == 1) {
                        bufferProducts = bufferProducts                        
                        .sort((a,b) => (
                            a.unit_price.match(regex)[0] > b.unit_price.match(regex)[0]) ? 1 : ((b.unit_price.match(regex)[0] > a.unit_price.match(regex)[0]) ? -1 : 0)
                        );
                    } else if(ordenar == 2) {
                        bufferProducts = bufferProducts
                        .sort((a,b) => (
                            a.reference_price.match(regex)[0] > b.reference_price.match(regex)[0]) ? 1 : ((b.reference_price.match(regex)[0] > a.reference_price.match(regex)[0]) ? -1 : 0)
                        );
                    }

                    componerCartas(bufferProducts,ordenar);
                    window.localStorage.setItem('data',bufferProducts);
                }

                counter++;

            }).fail((event) => {
                console.log(event);
                console.log('Failure: ' + elem);
                counter++;
            });
    });
}

const getUrlService = (companyname, productname) => {

    let url = '';

    switch (companyname) {
        case 'MERCADONA':
            url = 'http://localhost:3000/' + companyname + '/' + productname;
            break;
        case 'DIA':
        case 'CAPRABO':
        case 'CONDIS':
        case 'AMAZON':
            url = 'http://localhost:3000/search/' + productname + "/" + companyname;
            break;
        default:
            url = 'http://localhost:3000/searchbrowser/' + productname + "/" + companyname;
            break;
    }

    return url;
};

const liveSearch = (keyword) => {

    let posicion = 0;
	
	if(keyword === '' || keyword === undefined || keyword.indexOf("  ") >= 0) {
        $('#sugerencias').html('');
        $('#inputtext').removeClass("error");
        $('#sugerencias').css("display", "none");  
		return
	}
	
    $.ajax({
        type: "GET",
        url: "https://api.empathybroker.com/search/v1/query/bm/empathize?scope=empathize_desktop&lang=es&store=14973&user=14b589a9-aa07-4a9f-ab8f-a75926ecf8bd&session=d0feaaea-5cec-4344-9e54-2fcef0569347&user_type=new&rows=6&q=" + keyword,
        dataType: "text",
        timeout: 600000,
        beforeSend: function(xhr){
            //xhr.setRequestHeader ("Authorization", "Bearer " + window.localStorage.getItem('sia_token'));
            $('#inputtext').addClass('loading-live-search');
            $('#sugerencias').html('');
            $('#sugerencias').css("display", "none");             
        }
        }).done(function (data) {
			$('#inputtext').removeClass('loading-live-search');
			
			if(data === '[]') {
                $('#sugerencias').html('');                
                $('#sugerencias').css("display", "none");  
				return '';
			}

            $('#inputtext').removeClass("error");
			
			let datosJSON = jQuery.parseJSON(data);
			
            let ul = document.createElement('ul');

			datosJSON.topTrends.forEach(elem => {
                
				let li = document.createElement('li');
				li.classList.add('col-12');
				li.classList.add('divsugerencia');
                li.setAttribute('tabindex','-1');
                li.setAttribute('id','ls-' + posicion++);
				li.setAttribute('onclick','focoSerchBar(this);return false;');
				li.innerText = elem.title;
                ul.appendChild(li);
				$('#sugerencias').append(ul);
			});
                         
            $('#sugerencias').css("display", "block"); 
            $('#sugerencias').find('.sugerencia').each(function() {
                this.classList.add('pb-2');
                this.setAttribute("onclick","focoSerchBar(this);return false;");
            });
   
        }).fail(function (event) {
            console.log(event);
            if(event.status === 401) {
                alert('La sesión ha finalizado. Inicie sesión de nuevo.');
                window.location.href = '/login';
            } else {
                $('#inputtext').addClass("error");
            }
        });
}

const focoSerchBar = function(param) {
    $('#inputtext').val(param.innerText.trim());
    $('#sugerencias').html('');
    $('#sugerencias').css('display', 'none');
    let elemEmpresas = $('.imgChked');

    if(elemEmpresas != undefined && elemEmpresas.length != 0) {
        enviar();
    }
}

const componerCartas = function(bufferProducts, ordenar) {
    let estructuraHTML = '';
    let contador = 0;
    let position = 0;

    try {
        $('#productos').html('');
        
        let contenedor = $('#productos');
        let row;
        
        bufferProducts.forEach(element => {           

            if(contador === 0) {
                row = document.createElement("div");
                row.classList.add("row");
                row.classList.add("pb-3");
                contenedor.append(row);
            }

            estructuraHTML = '<div class="col-md-6 col-lg-2 col-sm-12 mb-3 crd">';
            estructuraHTML += '<div class="card card-block crd h-100 showcard">';            
            estructuraHTML += '<h4 class="card-title">';
            estructuraHTML += imagenLogoEmpresa(element.name);
            estructuraHTML += colorIdentificador(++position);
            estructuraHTML += '</h4>'

            let imagePath = element.image != undefined ? element.image.replace('40x40','600x600') : '';

            if(element.didEmpresa == 101) {
                estructuraHTML += '<img class="imgprod" loading="lazy" src="' + imagePath + '" alt=" Producto" title="No se puede acceder a los productos de Mercadona" />';
            } else {
                estructuraHTML += '<a href="' + element.link + '" target="_blank" rel="noopener noreferrer">';
                estructuraHTML += '<img class="imgprod" loading="lazy" src="' + imagePath + '" alt=" Producto" />';
                estructuraHTML += '</a>';               
            }
            
            estructuraHTML += '<h5 class="card-title p-2">' + element.product + '</h5>';

            let un_price = element.unit_price.includes('€') ? element.unit_price : element.unit_price + ' €';
            let re_price = element.reference_price.includes('€') ? element.reference_price : element.reference_price + ' €';

            if(ordenar === 1) {                
                estructuraHTML += '<p class="text pl-2"><strong>Precio ' + un_price + '</strong><br />P. Ref  ' + re_price + '</p>';
            } else {
                estructuraHTML += '<p class="text pl-2"><strong>P. Ref ' + re_price + '</strong><br />Precio  ' + un_price + '</p>';   
            } 
            estructuraHTML += '</div></div>';

            let card = document.createRange().createContextualFragment(estructuraHTML);
            row.appendChild(card); 

            ++contador;
            if(contador === 6) {
                contador = 0;
            }
        });  
    } catch(error) {      
        $('#cajamensajes').css("display", "block");
        console.log(error);
    }
}

const colorIdentificador = function(identificador) {
	
    let span = document.createElement('span');
	
	switch (parseInt(identificador)) {
	case 1:
        span.classList.add("ident-primero");
		break;
	case 2:
        span.classList.add("ident-segundo");
		break;
	case 3:
        span.classList.add("ident-tercero");
		break;
	default:
        span.classList.add("ident-resto");
		break;
	}

    span.innerText = identificador
	
	return span.outerHTML;
}

const imagenLogoEmpresa = function(didEmpresa) {

    let img = document.createElement('img');
    img.classList.add('w-50', 'pt-2', 'pl-2', 'pb-2', 'climg', 'sm-img');

    switch (didEmpresa) {
        case "MERCADONA":
            img.setAttribute('src','./img/mercadona.svg');
            img.setAttribute('alt', 'mercadona');
            break;
        case "LIDL":
            img.setAttribute('src','./img/lidl.png');
            img.setAttribute('alt', 'lidl');
            break;
        case "HIPERCOR":
            img.setAttribute('src','./img/hipercor.svg');
            img.setAttribute('alt', 'hipercor');
            break;
        case "DIA":            			
            img.setAttribute('src','./img/dia.svg');
            img.setAttribute('alt', 'dia');
            break;
         case "ULABOX":            			
            img.setAttribute('src','./img/ulabox.svg');
            img.setAttribute('alt', 'ulabox');
            break;
         case "EROSKI":         
             img.setAttribute('src','./img/eroski.svg');
             img.setAttribute('alt', 'eroski');   
             break;			
         case "ALCAMPO": 			
            img.setAttribute('src','./img/alcampo.svg');
            img.setAttribute('alt', 'alcampo');
            break;
         case "CAPRABO":	
            img.setAttribute('src','./img/caprabo.svg');
            img.setAttribute('alt', 'caprabo');
            break;
         case "CARREFOUR":	
            img.setAttribute('src','./img/carrefour.svg');
            img.setAttribute('alt', 'carrefour');
            break;
         case "CONDIS":	
            img.setAttribute('src','./img/condis.svg');
            img.setAttribute('alt', 'condis');
            break;
         case "ELCORTEINGLES":		
            img.setAttribute('src','./img/elcorteingles.svg');
            img.setAttribute('alt', 'elcorteingles');
            break;
         case "AMAZON":		
            img.setAttribute('src','./img/amazon.svg');
            img.setAttribute('alt', 'amazon');
            break;
         case "CONSUM":		
            img.setAttribute('src','./img/consum.svg');
            img.setAttribute('alt', 'consum');
            break;
    }
    return img.outerHTML;
}

function resize() {
    let ancho = window.outerWidth;

    if(ancho <= 1023) {
        $('#rowempresas').removeClass('ml-2');
        $('#colinput').addClass('pt-1 colinp');
        $('#radiogroupid').removeClass('ml-2');
        $('#radiogroup').removeClass('offset-1');

        if($('#boton-volver').length) {
            $('#boton-volver').css("display", "none");
        }

        if($('#select-top').length) {
            $('#select-top').css("display", "none");
        }
        
        $('#productos').removeClass('mt-4');
        $('#productos').addClass('pt-4 pl-5 pr-5');

        let listaTd = $('td');

        for (let index = 0; index < listaTd.length; index++) {
            listaTd[index].classList.remove('p-3');
            listaTd[index].classList.add('p-1');
            
        }

        let cajaLogoCheckedBorder = $('.border');

        for (let index = 0; index < cajaLogoCheckedBorder.length; index++) {
            cajaLogoCheckedBorder[index].classList.remove('col-1');
            cajaLogoCheckedBorder[index].classList.add('col-2');
        }

        let logoProducto = $('.climg');

        for (let index = 0; index < logoProducto.length; index++) {
            logoProducto[index].classList.remove('w-50');
            logoProducto[index].classList.add('w-25');
        } 
        
        let logochecked = document.querySelectorAll('#caja-logos-checked > div:nth-child(n) > img');

        for (let index = 0; index < logochecked.length; index++) {
            logochecked[index].classList.remove('w-50');
            logochecked[index].classList.remove('w-100');
            logochecked[index].classList.remove('climg');
            logochecked[index].classList.add('w-25');
        }

        let cardinal = $('.cardinal');

        for (let index = 0; index < cardinal.length; index++) {
            cardinal[index].classList.remove('w-50');
            cardinal[index].classList.remove('w-100');
            cardinal[index].classList.remove('w-75');
            cardinal[index].classList.add('w-25');        
        }

        $('group-selector').addClass( "col-4" );

    } else {
        $('#rowempresas').addClass('ml-2');
        $('#radiogroupid').addClass('ml-2');
        $('#radiogroup').addClass('offset-1');
        $('#colinput').removeClass('pt-5 colinp')

        if($('#boton-volver').length) {
            $('#boton-volver').css("display", "block");
        }

        if($('#select-top').length) {
            $('#select-top').css("display", "block");
        }
        
        let listaTd = $('td');

        for (let index = 0; index < listaTd.length; index++) {
            listaTd[index].classList.remove('p-1');
            listaTd[index].classList.add('p-3');            
        }

        let cajaLogoCheckedBorder = $('.border');

        for (let index = 0; index < cajaLogoCheckedBorder.length; index++) {
            cajaLogoCheckedBorder[index].classList.remove('col-2');
            cajaLogoCheckedBorder[index].classList.add('col-1');
        }

        let logoProducto = $('.climg');

        for (let index = 0; index < logoProducto.length; index++) {
            logoProducto[index].classList.remove('w-25');
            logoProducto[index].classList.add('w-50');
        }

        let logochecked = document.querySelectorAll('#caja-logos-checked > div:nth-child(n) > img');

        for (let index = 0; index < logochecked.length; index++) {
            logochecked[index].classList.remove('w-50');
            logochecked[index].classList.remove('w-100');
            logochecked[index].classList.remove('climg');
            logochecked[index].classList.add('w-100');
        }
    }

    let element = $('.cardinal');

    for (let index = 0; index < element.length; index++) {
    	element[index].classList.remove('w-50');
    	element[index].classList.remove('w-75');
    	element[index].classList.add('w-100');
    }

    $('group-selector').removeClass( "col-4" );
    
    return this;
}