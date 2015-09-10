/**
 * Created by emaneff on 07/09/2015.
 */
(function () {
    'use strict';

    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    angular.module('acContacto', ['ngRoute'])
        .directive('acAngularContacto', AcAngularContacto)
        .factory('acAngularContactoService', AcAngularContactoService);


    AcAngularContacto.$inject = ['$location', '$route', '$timeout', 'acAngularContactoService'];

    function AcAngularContacto($location, $route, $timeout, acAngularContactoService) {
        return {
            restrict: 'E',
            scope: {
                model: '@'
            },
            templateUrl: currentScriptPath.replace('.js', '.html'),
            controller: function ($scope, $http) {

                //Variables
                var vm = this;
                vm.mail = '';
                vm.name = '';
                vm.subject = '';
                vm.comment = '';
                vm.message = '';

                //Mensajes
                vm.mail_error = '';
                vm.name_error = '';
                vm.subject_error = '';
                vm.comment_error = '';

                //Variables para cambiar el estilo de las clases css dinamicamente
                vm.mailError = 0;
                vm.nameError = 0;
                vm.subjectError = 0;
                vm.commentError = 0;
                vm.mailWarning = 0;
                vm.showMessage = 0;


                //Funciones
                vm.sendMail = sendMail;

                /**
                 * Valida que el mail ingresado sea valido
                 * @param email
                 * @returns {boolean}
                 *  True es valido.
                 *  False es invalido.
                 */
                function validateEmail(email)
                {
                    var re = /\S+@\S+\.\S+/;
                    return re.test(email)
                }

                /**
                 *
                 */
                function validateName() {
                    if(vm.name.trim().length == 0) {
                        vm.name_error = 'El Nombre es obligatorio';
                        vm.nameError = 1;
                    }
                    else {
                        vm.name_error = '';
                        vm.nameError = 0;
                    }
                }

                /**
                 *
                 */
                function validateSubject() {
                    if(vm.subject.trim().length == 0) {
                        vm.subject_error = 'El Asunto es obligatorio';
                        vm.subjectError = 1;
                    }
                    else {
                        vm.subject_error = '';
                        vm.subjectError = 0;
                    }
                }

                /**
                 *
                 */
                function validateComment() {
                    if(vm.comment.trim().length == 0) {
                        vm.comment_error = 'El cuerpo del mensaje es obligatorio';
                        vm.commentError = 1;
                    }
                    else {
                        vm.comment_error = '';
                        vm.commentError = 0;
                    }
                }

                /**
                 *
                 */
                function validateMail() {
                    if(vm.mail === undefined || vm.mail.trim().length == 0) {
                        vm.mail_error = 'El Mail es obligatorio';
                        vm.mailError = 1;
                    }
                    else {
                        vm.mail_error = '';
                        vm.mailError = 0;
                    }
                }

                /**
                 *
                 */
                function cleanErrorMessage(){
                    vm.name_error = '';
                    vm.nameError = 0;
                    vm.subject_error = '';
                    vm.subjectError = 0;
                    vm.comment_error = '';
                    vm.commentError = 0;
                }

                function cleanInputs() {
                    vm.mail = '';
                    vm.name = '';
                    vm.subject = '';
                    vm.comment = '';
                }

                /*******************************************************************/
                /**
                 *
                 */
                function hideMessage(){
                    vm.showMessage = 0;
                    cleanInputs();
                }

                /**
                 * Envia mail con la consulta
                 * @param to: Destinatario del mail
                 */
                function sendMail(to){
                    if((vm.subject.trim().length > 0) && (vm.name.trim().length > 0) && (vm.comment.trim().length > 0)
                    && (vm.mail != undefined && vm.mail.trim().length > 0)) {
                        //Valida que el mail ingresado sea valido
                        if(validateEmail(vm.mail.trim())) {
                            cleanErrorMessage();
                            vm.mail_error = '';
                            vm.mailError = 0;
                            vm.mailWarning = 0;

                            acAngularContactoService.sendMail(to, vm.subject.trim(), vm.comment.trim(), vm.mail.trim(), function(data){
                                vm.showMessage = 1;
                                if(data) {
                                    vm.message = 'Su consulta fue enviada';
                                    $timeout(hideMessage, 3000);
                                }
                                else {
                                    vm.message = 'Se produjo un error al enviar su consulta';
                                }
                            });
                        }
                        else {
                            cleanErrorMessage();
                            vm.mail_error = 'Ingrese un mail valido';
                            vm.mailWarning = 2;
                        }
                    }
                    else {
                        validateMail();
                        validateName();
                        validateSubject();
                        validateComment();
                    }
                }

            },
            controllerAs: 'contactoCtrl'
        }
    }

    /*****************************************************************************************************/

    AcAngularContactoService.$inject = ['$http'];

    /**
     * Servicio de contacto para envio de mails
     * @param $http
     * @returns {{}}
     * @constructor
     */
    function AcAngularContactoService($http) {
        //Variables
        var service = {};

        //Recupero la url donde tengo la clase para enviar mails
        var url = currentScriptPath.replace('contacto.js', 'contacto.php');

        //Function declarations
        service.sendMail = sendMail;

        return service;

        /**
         *  Envio el mail con la consulta
         * @param to: Destinatario del mail
         * @param subject: Asunto del mail
         * @param message: Cuerpo del mensaje
         * @param email: Quien escribe el mail
         * @param callback
         * @returns {*}
         */
        function sendMail(to, subject, message, email, callback) {
            return $http.post(url,
                {
                    function: 'sendMail',
                    'to': to,
                    'subject': subject,
                    'message': message,
                    'email': email
                })
                .success(function (data) {
                    callback(data);
                })
                .error(function (data) {
                    callback(data);
                });
        }

    }



})();