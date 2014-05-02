/*wowsearchform 2.1*/
(function(c,b,d){var a=function(f,e){this.$element=c(f);this.options=c.extend({},c.fn.wowsearchform.defaults,c.fn.wowsearchform.regional,e);this.init("wowsearchform",f,this.options)};a.prototype={constructor:a,init:function(i,h,f){var j,g,k,e;g=this;g.filters=0;g.form=this.$element;c(g.form).wrapInner("<fieldset>");g.master=c("fieldset:first-child",g.form);c(g.form).find(g.options.btnReset).addClass("wowNoClone").click(function(){g.reset()});k=c("input:text",g.form);g.original_textbox=c(k).clone();e=c("<select>").attr("name","operator[]").addClass("operator form-control").insertBefore(k);g._fillOperator(e,"number");c('<div class="btn-group">').insertAfter(k).append('<a class="btnAdd '+g.options.buttons_class+'" title="'+g.options.filter_add_tooltip+'">'+g.options.button_add_text+"</a>");g.area_logic=c("<fieldset>").appendTo(g.form).hide().append('<div class="radiobox"><label><input type="radio" name="logic" value="AND" checked="checked"> '+g.options.radio_AND_label+'</label> <label><input type="radio" name="logic" value="OR"> '+g.options.radio_OR_label+"</label></div>");g._bindEvent(g.master)},reset:function(){var e=this;c("fieldset.wowChild",e.form).remove();e.filters=0;c(e.area_logic).find("input[type=radio]:first").prop("checked",true);c(e.area_logic).hide();c("input:text",e.form).val("");c("select",e.form).prop("selectedIndex",0)},_bindEvent:function(i){var e,h;e=this;var f=c("input:text",i);var g=c("select.operator",i);c("select.wowFields",i).change(function(){c("option:selected",this).each(function(){h=c(this).attr("class");e._fillOperator(g,h);if(e.options.datepick===true){if(typeof(jQuery.ui.datepicker)!="undefined"){if(h==="date"){if(!c(f).hasClass("hasDatepicker")){c(f).datepicker()}}else{if(c(f).hasClass("hasDatepicker")){c(f).datepicker("destroy")}}}}})}).trigger("change");c("a.btnAdd",i).bind("click",function(){e._addFilter()})},_fillOperator:function(g,e){var f;if(e=="number"||e=="date"){f=this.options.operator_for_number}else{f=this.options.operator_for_text}c(g).find("option").remove().end();c.each(f,function(h,i){c(g).append(c("<option>",{value:h}).text(i))})},_addFilter:function(){var g,e;g=this;e=c(g.master).clone().addClass("wowChild").insertBefore(g.area_logic).hide();c(".wowNoClone",e).remove();c("input:text",e).replaceWith(c(g.original_textbox).clone());var f=c(".btn-group",e);c('<a class="'+g.options.buttons_class+'" title="'+g.options.filter_remove_tooltip+'">'+g.options.button_remove_text+"</a>").appendTo(f).bind("click",function(){g._removeFilter(e)});c(e).fadeIn();g._bindEvent(e);g.filters++;if(g.filters===1){c(g.area_logic).fadeIn()}},_removeFilter:function(f){var e=this;if(e.filters===1){c(e.area_logic).fadeOut();e.filters=0}else{e.filters--}if(e.options.datepick===true){c(".hasDatepicker",f).each(function(){c(this).datepicker("destroy")})}c(f).fadeOut(function(){c(this).remove()})}};c.fn.wowsearchform=function(e){return this.each(function(){var g=c(this);var f=g.data("wow.searchform");if(!f){g.data("wow.searchform",(f=new a(this,e)))}if(typeof e=="string"){f[e].call(g)}})};c.fn.wowsearchform.defaults={datepick:true,radio_AND_label:"Soddisfi tutte le condizioni",radio_OR_label:"Soddisfi anche una sola condizione",filter_add_tooltip:"Aggiungi nuovo filtro di ricerca",filter_remove_tooltip:"Rimuovi filtro di ricerca",operator_for_text:{LIKE:"contiene",EQUAL:"uguale a",_LIKE:"inizia con",LIKE_:"termina con",NOT:"diverso da","NOT LIKE":"non contiene",EMPTY:"è vuoto"},operator_for_number:{"=":"uguale",">":"maggiore di","<":"minore di","!=":"diverso da",EMPTY:"è vuoto"},buttons_class:"btn btn-default",button_add_text:"+",button_remove_text:"-",btnReset:".wowReset"};c.fn.wowsearchform.Constructor=a;c(b).on("load",function(){c("form.wowsearchform").wowsearchform()})}(jQuery,window));