/*!wowsearchform 2.1*/
/*
 *  Project: WOW Search Form
 *  Nested html search form
 *  http://wowsearchform.sourceforge.net
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and LGPL (http://opensource.org/licenses/LGPL-3.0) licenses.
 * Copyright (c) 2014 Moreno Monga
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 * @name wowsearchform
 * @requires jQuery
 * @author Moreno Monga (http://programmatorepercaso.blogspot.com)
 * @version 2.1
 * @license LGPL or MIT
 */

;(function ( $, window, undefined ) {
	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window is passed through as local variable rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	"use strict"; // jshint ;_;


	var Wowsearchform = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.wowsearchform.defaults, $.fn.wowsearchform.regional, options);
		this.init('wowsearchform', element, this.options);
	};

	Wowsearchform.prototype = {

		constructor: Wowsearchform,


		/**
		 *  @brief Init plugin
		 *
		 */
		init: function (type, element, options) {
			var	form,
				t,
				elm_textbox,
				operator;

			//init
			t= this;
			t.filters=0;
			t.form = this.$element ;

			//first filter: wrap form content with fieldset
			$(t.form).wrapInner('<fieldset>');
			t.master = $("fieldset:first-child", t.form );
			//search reset button btnReset
			$(t.form).find(t.options.btnReset).addClass("wowNoClone").click(function() { 	t.reset(); 	});
			//
			elm_textbox = $('input:text', t.form);
			//save a copy of original textbox
			t.original_textbox= $(elm_textbox).clone();

			//build select "operator"
			operator = $("<select>").attr('name', "operator[]").addClass('operator form-control').insertBefore(elm_textbox);

			t._fillOperator(operator,"number");

			//build button "add filter"
			/*
			$("<a>").attr({
				'class': 'btnAdd ' + t.options.buttons_class,
				'title': t.options.filter_add_tooltip
			}).html( t.options.button_add_text ).insertAfter(elm_textbox);
			* */
			$('<div class="btn-group">').insertAfter(elm_textbox).append('<a class="btnAdd ' + t.options.buttons_class+'" title="'+t.options.filter_add_tooltip+'">'+t.options.button_add_text+'</a>');

			//build logic radio box
			t.area_logic = $('<fieldset>').appendTo(t.form).hide()
			//add radio box
			.append('<div class="radiobox"><label><input type="radio" name="logic" value="AND" checked="checked"> '+ t.options.radio_AND_label+ '</label> <label><input type="radio" name="logic" value="OR"> '+ t.options.radio_OR_label+ '</label></div>');
			t._bindEvent( t.master );

		},

		/** Public function
		 *  @brief reset and purge filters
		 */
		reset: function () {
			var t = this;
			//remove filters child
			$('fieldset.wowChild', t.form).remove();
			t.filters = 0;
			//set default logic 
			$(t.area_logic).find('input[type=radio]:first').prop('checked', true);
			$(t.area_logic).hide();
			//clear text
			$('input:text', t.form).val('');
			//reset selected options
			$('select', t.form).prop('selectedIndex',0);
		},

		/** Private function
		 *  @brief bind event for filter
		 * @elm div element to bind
		 */
		_bindEvent: function (elm) {
			var t,
				data_type;
			t = this;

			//element handle
			var input_text = $('input:text', elm);
			var select_operator = $('select.operator', elm);

			$("select.wowFields", elm).change(function () {
				$("option:selected",this).each(function () {
					//get data type... from class name
					data_type = $(this).attr('class') ;
					//fill operator select
					t._fillOperator(select_operator,data_type);
					//attach/detach datepicker
					if(t.options.datepick ===  true){
						//check if the external plugin is installed
						if (typeof(jQuery.ui.datepicker) != 'undefined'){

							if(data_type === "date" ){
								//attach datepicker (external plugin)
								if (!$(input_text).hasClass('hasDatepicker')){
									$(input_text).datepicker();
								}
							}
							else{
								if ($(input_text).hasClass('hasDatepicker')){
									//detach datepicker (external plugin)
									$(input_text).datepicker('destroy');
								}
							}
						}
					}
				});
			}).trigger('change');

			//bind event add filter
			$("a.btnAdd",elm).bind('click', function() {
				t._addFilter();
			});
			
			/*MMM REMOVED UNUSED OPTIONS
			//attach tooltip (external plugin)
			if(t.options.tooltip ===  true){
				$("a.btnFilter", elm).tooltip();
			}
			/**/
		
		},


		/** Private function
		 * @brief fill select element "operator"
		 * @elm select element to fill
		 * @type type of current selected field
		 */
		_fillOperator: function (elm, type) {
			var sel_options;
			if (type == "number" || type == "date"){
				sel_options = this.options.operator_for_number;
			}
			else{
				sel_options = this.options.operator_for_text;
			}
			//empty elm
			$(elm).find('option').remove().end();
			//fill select "operator"
			$.each(sel_options, function(key, value) {
				$(elm).append($('<option>', { value : key }).text(value));
			});
		},


		/** Private function
		 *  @brief Add new filter row
		 */
		_addFilter: function () {
			var	t,
				slave;
			t = this;

			//clone fieldset 'master' and remove class master
			slave = $(t.master).clone().addClass("wowChild").insertBefore(t.area_logic).hide();
			//remove no clone elements
			$('.wowNoClone', slave).remove();
			//replace textbox with a copy of original textbox (to fix problem datepicker attached)
			$('input:text', slave).replaceWith($(t.original_textbox).clone());
			var btngroup = $('.btn-group', slave);
			$('<a class="' + t.options.buttons_class+'" title="'+t.options.filter_remove_tooltip+'">'+t.options.button_remove_text+'</a>')
			.appendTo(btngroup)
			.bind('click', function() {
				t._removeFilter(slave);
			});
			//show slave row
			$(slave).fadeIn();
			//attach event
			t._bindEvent(slave);

			//increase slave filter counter
			t.filters++;
			if(t.filters === 1 ){
				//show  logic area (radio box)
				$(t.area_logic).fadeIn();
			}
		},

		/** Private function
		 *  @brief Remove current filter row
		 *  @param elm_filter: filter element (div) to remove
		 */
		_removeFilter: function (elm_filter) {
			var t = this;

			if(t.filters === 1 ){
				//hide  logic radio box
				$(t.area_logic).fadeOut();
				t.filters = 0;
			}
			else
				//decrease filter counter
				t.filters--;
			//detach datepicker (external plugin)
			if(t.options.datepick ===  true){
				//check if textbox is attached to datepicker
				$('.hasDatepicker', elm_filter ).each(function() {
					//detach datepicker
					$(this).datepicker('destroy');
				});
			}
			/*MMM REMOVED UNUSED OPTIONS
			//detach tooltip (external plugin)
			if(t.options.tooltip ===  true){
				$("a.btnFilter", elm_filter).tooltip('destroy');
			}
			/**/
			//remove filter with animation
			$(elm_filter).fadeOut(function() {
				$(this).remove();
			});
		}

	//close plugin
	};


 /* PLUGIN DEFINITION
  * ========================= */

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.wowsearchform = function ( options ) {
		/*
		return this.each(function () {
			if (!$.data(this, 'wowsearchform' )) {
				$.data(this, 'wowsearchform' , new Wowsearchform( this, options ));
			}
		});
		/**/
		return this.each(function () {
			var $this = $(this)
			var data  = $this.data('wow.searchform')
			if (!data) $this.data('wow.searchform', (data = new Wowsearchform(this, options)))
			if (typeof options == 'string') data[options].call($this)
		})
    };

	$.fn.wowsearchform.defaults = {
		//MMM REMOVED UNUSED OPTIONS> tooltip: false,
		//enable datepick to "date" field: require external plugin : jquery.ui.datepicker.js
		datepick: true,
		//location layout labels
		radio_AND_label: "Soddisfi tutte le condizioni",
		radio_OR_label: "Soddisfi anche una sola condizione",
		filter_add_tooltip: "Aggiungi nuovo filtro di ricerca",
		filter_remove_tooltip: "Rimuovi filtro di ricerca",
		//data to fill SELECT "operator" element if it has class "text" or nothing
		operator_for_text: { 'LIKE': "contiene", 'EQUAL': "uguale a", '_LIKE': "inizia con", 'LIKE_': "termina con", 'NOT': "diverso da" , 'NOT LIKE': "non contiene", 'EMPTY': "è vuoto" },
		//data to fill SELECT "operator" element if it has class "number"
		operator_for_number:  { '=': "uguale",  '>': "maggiore di",  '<': "minore di", '!=': "diverso da", 'EMPTY': "è vuoto" },
		//buttons class
		buttons_class: "btn btn-default", //compatible bootstrap 3
		//buttons html labels
		button_add_text: '+',
		button_remove_text: '-',
		/*example with icons font glyphicon by Bootstrap (http://getbootstrap.com/)
		button_add_text: '<i class="glyphicon glyphicon-plus"></i>',
		button_remove_text: '<i class="glyphicon glyphicon-minus"></i>'
		/**/
		/*example with icons font fontawesome (http://fontawesome.io/icons/)
		button_add_text: '<i class="fa fa-plus"></i>',
		button_remove_text: '<i class="fa fa-minus"></i>'
		/**/
		//reset button element identify (to must be inside form)
		btnReset: ".wowReset"

	};

	$.fn.wowsearchform.Constructor = Wowsearchform;

 /* AFFIX DATA-API
  * ============== */
	$(window).on('load', function () {
		$('form.wowsearchform').wowsearchform();
	});

}(jQuery, window));
