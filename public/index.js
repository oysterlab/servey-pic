const $ = require('jquery')
const Survey = require('survey-jquery')
const ImagePicker = require('./image-picker').default
const request = require('browser-request');

Survey.Survey.cssType = "bootstrap"
Survey.defaultBootstrapCss.navigationButton = "btn btn-green"

$('body').css({
  margin: '0px',
  padding: '0px',
})

request('/survey-model.json', (err, response, data) => {
  const serveyDom = $('<div></div>')

  Survey.Survey.cssType = "bootstrap";
  Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

  Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "imagepicker"]});

  window.survey = new Survey.Model(JSON.parse(data))

  survey.onComplete.add(function(result) {
    request({method:'POST', url:'/receive-survey', json:{survey: result.data}}, (res) => {
      console.log(res)
    })
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
              options[i].selected = (question.value || []).reduce((v, item) => {
                if (item == options[i].value) v = true;
                return v;
              }, false);
          }

          const picker = new ImagePicker($el, {
              hide_select : true,
              show_label  : false,
              selected: function(opts) {
                  question.value = opts.picker.select.val()
              }
          }, $)

          $(el).find('.image_picker_image').css({
            width: '44vw'
          })
        },
        willUnmount: function(question, el) {
          var $el = $(el).find("select");
  //      $el.data('picker').destroy();
        }

  }

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
  serveyDom.Survey({model: survey})

  $('body').append(serveyDom)
})
