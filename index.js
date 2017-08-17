const $ = require('jquery')
const Survey = require('survey-jquery')
const ImagePicker = require('./image-picker').default

Survey.Survey.cssType = "bootstrap"
Survey.defaultBootstrapCss.navigationButton = "btn btn-green"

$('body').css({
  margin: '0px',
  padding: '0px',
})

const serveyDom = $('<div></div>')

Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "imagepicker"]});

window.survey = new Survey.Model(
  {
   pages: [
     {
       questions: [
         { type: "dropdown", name: "choosepicture", renderAs: "imagepicker", title: "What animal would you like to see first ?",
             choices: [
                {value: "lion", text: "http://surveyjs.org/images/image-picker/lion.jpg"},
                {value: "giraffe", text: "http://surveyjs.org/images/image-picker/giraffe.jpg"},
                {value: "panda", text: "http://surveyjs.org/images/image-picker/panda.jpg"},
                {value: "camel", text: "http://surveyjs.org/images/image-picker/camel.jpg"}
             ]
          }
       ],
       name: "page1"
    },
    {
      questions: [
        { type: "dropdown", name: "choosepicture2", renderAs: "imagepicker", title: "What animal would you like to see first ?",
            choices: [
               {value: "liona", text: "http://surveyjs.org/images/image-picker/lion.jpg"},
               {value: "giraffea", text: "http://surveyjs.org/images/image-picker/giraffe.jpg"},
               {value: "pandaa", text: "http://surveyjs.org/images/image-picker/panda.jpg"},
               {value: "camela", text: "http://surveyjs.org/images/image-picker/camel.jpg"}
            ]
         }
      ],
      name: "page2"
   }
   ]
 })

survey.onComplete.add(function(result) {
	document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
});


var widget = {
    name: "imagepicker",
    isFit : function(question) { return question["renderAs"] === 'imagepicker'; },
    isDefaultRender: true,
    afterRender: function(question, el) {

        var $el = $(el).find("select");
        $el.attr('multiple', 'multiple')

        var options = $el.find('option');
        for (var i=1; i<options.length; i++) {
            $(options[i]).data("imgSrc", options[i].text);
            options[i].selected = question.value == options[i].value;
        }

        const picker = new ImagePicker($el, {
            hide_select : true,
            show_label  : false,
            selected: function(opts) {
                question.value = opts.picker.select[0].value;
            }
        }, $)

        $(el).find('.image_picker_image').css({
          width: '44vw'
        })
    },
    willMount: function(question, el) {
      console.log(el)
    }
        ,
        willUnmount: function(question, el) {
            var $el = $(el).find("select");
//            $el.data('picker').destroy();
        }

}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
serveyDom.Survey({model: survey})

$('body').append(serveyDom)
