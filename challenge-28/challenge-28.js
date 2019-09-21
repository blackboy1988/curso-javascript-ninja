  (function(win, doc) {
    'use strict';
      /*
    No HTML:
    - Crie um formulário com um input de texto que receberá um CEP e um botão
    de submit;
    - Crie uma estrutura HTML para receber informações de endereço:
    "Logradouro, Bairro, Estado, Cidade e CEP." Essas informações serão
    preenchidas com os dados da requisição feita no JS.
    - Crie uma área que receberá mensagens com o status da requisição:
    "Carregando, sucesso ou erro."

    No JS:
    - O CEP pode ser entrado pelo usuário com qualquer tipo de caractere, mas
    deve ser limpo e enviado somente os números para a requisição abaixo;
    - Ao submeter esse formulário, deve ser feito um request Ajax para a URL:
    "https://api.postmon.com.br/v1/cep/*cep_a_consultar*", onde [CEP] será o CEP passado
    no input criado no HTML;
    - Essa requisição trará dados de um CEP em JSON. Preencha campos na tela
    com os dados recebidos.
    - Enquanto os dados são buscados, na área de mensagens de status, deve mostrar
    a mensagem: "Buscando informações para o CEP [CEP]..."
    - Se não houver dados para o CEP entrado, mostrar a mensagem:
    "Não encontramos o endereço para o CEP [CEP]."
    - Se houver endereço para o CEP digitado, mostre a mensagem:
    "Endereço referente ao CEP [CEP]:"
    - Utilize a lib DOM criada anteriormente para facilitar a manipulação e
    adicionar as informações em tela.
    */

    function DOM(elements) {
      this.elements = this.getElements(elements);
    }

    DOM.prototype.getElements = function getElements(elements) {
      return doc.querySelectorAll(elements);
    };

    DOM.prototype.on = function on(event, callback) {
      Array.prototype.forEach.call(this.elements, function(item) {
        item.addEventListener(event, callback, false);
      });
    };

    DOM.prototype.off = function off(event, callback) {
      Array.prototype.forEach.call(this.elements, function(item) {
        item.removeEventListener(event, callback, false);
      });
    };

    DOM.prototype.get = function get() {
      return this.elements;
    };

    DOM.prototype.forEach = function forEach() {
      return Array.prototype.forEach.apply(this.elements, arguments);
    };

    DOM.prototype.map = function map() {
      return Array.prototype.map.apply(this.elements, arguments);
    };

    DOM.prototype.filter = function filter() {
      return Array.prototype.filter.apply(this.elements, arguments);
    };

    DOM.prototype.reduce = function reduce() {
      return Array.prototype.reduce.apply(this.elements, arguments);
    };

    DOM.prototype.reduceRight = function reduceRight() {
      return Array.prototype.reduceRight.apply(this.elements, arguments);
    };

    DOM.prototype.every = function every() {
      return Array.prototype.every.apply(this.elements, arguments);
    };

    DOM.prototype.some = function some() {
      return Array.prototype.some.apply(this.elements, arguments);
    };

    DOM.isArray = function isArray(param) {
      return Object.prototype.toString.call(param) === '[object Array]';
    };

    DOM.isObject = function isObject( param ) {
      return Object.prototype.toString.call(param) === '[object Object]';
    };

    DOM.isFunction = function isFunction(param) {
      return Object.prototype.toString.call(param) === '[object Function]';
    };

    DOM.isNumber = function isNumber(param) {
      return Object.prototype.toString.call(param) === '[object Number]';
    };

    DOM.isString = function isString(param) {
      return Object.prototype.toString.call(param) === '[object String]';
    };

    DOM.isBoolean = function isBoolean(param) {
      return Object.prototype.toString.call(param) === '[object Boolean]';
    };

    DOM.isNull = function isNull(param) {
      return Object.prototype.toString.call(param) === '[object Null]'
      || Object.prototype.toString.call(param) === '[object Undefined]';
    };

    var $logradouro = new DOM('[data-js="logradouro"]');
    var $bairro = new DOM('[data-js="bairro"]');
    var $estado = new DOM('[data-js="estado"]');
    var $cidade = new DOM('[data-js="cidade"]');
    var $cep = new DOM('[data-js="cep"]');
    var $status = new DOM('[data-js="status"]');
    var $inputCEP = new DOM('[data-js="input-cep"]');
    var $formCEP = new DOM('[data-js="form-cep"]');
    $formCEP.on('submit', handleSubmit);

    var ajax = new XMLHttpRequest();

    function handleSubmit(e) {
      e.preventDefault();
      var url = 'https://api.postmon.com.br/v1/cep/*cep_a_consultar*'.replace(
        '*cep_a_consultar*',
        clearCEP()
      );
      ajax.open('GET', url);
      ajax.send();
      status('loading');

      ajax.addEventListener('readystatechange', handleReadystateChange, false);
    }

    function clearCEP() {
      return $inputCEP.get()[0].value.replace(/\D/g, '');
    }

    function handleReadystateChange() {
      if( isRequestOk() ){
        status('ok');
        populationForm();
      }
    }

    function isRequestOk() {
      return ajax.readyState === 4 && ajax.status === 200;
    }

    function parseRequest() {
      var result;
      try {
        result = JSON.parse(ajax.responseText);
      }
      catch(e) {
        result = null;
      }
      return result;
    }

    function populationForm() {
      var data = parseRequest();
      if(!data) {
        status('error');
      }
      $logradouro.get()[0].textContent = data.logradouro;
      $bairro.get()[0].textContent = data.bairro;
      $estado.get()[0].textContent = data.estado;
      $cidade.get()[0].textContent = data.cidade;
      $cep.get()[0].textContent = data.cep;
    }

    function status(type) {
      var message = {
        ok: 'Endereço referente ao CEP [CEP]:',
        loading: 'Buscando informações para o CEP [CEP]...',
        error: 'Não encontramos o endereço para o CEP [CEP].'
      };
      return $status.get()[0].textContent = message[type].replace(
        '[CEP]',
        clearCEP()
      );
    }

  })(window, document);
