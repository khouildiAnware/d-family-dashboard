 $(document).ready(function() {
  (function ( $ ) {
 
    $.fn.imagePicker = function(src , options ) {
              // Define plugin options
              var settings = $.extend({
                  // Input name attribute
                  name: "",
                  // Classes for styling the input
                  class: "form-control btn btn-default btn-block",
                  // Icon which displays in center of input
                  icon: "glyphicon glyphicon-plus"
              }, options );
              
              if(src && src!= "") {
                // creating a preview element
                return this.each(function() {
                    $(this).html(create_preview(this, src, settings));
                });
              }
              else {
                // Create an input inside each matched element
                return this.each(function() {
                    $(this).html(create_btn(this, settings));
                });
              }
       
          };
       
          // Private function for creating the input element
          function create_btn(that, settings) {
              // The input icon element
              var picker_btn_icon = $('<i class="'+settings.icon+'"></i>');
              
              // The actual file input which stays hidden
              var picker_btn_input = $('<input type="file"  name="'+settings.name+'" />');
              
              // The actual element displayed
              var picker_btn = $('<div class="'+settings.class+' img-upload-btn"></div>')
                  .append(picker_btn_icon)
                  .append(picker_btn_input);
                  
              // File load listener
              picker_btn_input.change(function() {
                  if ($(this).prop('files')[0]) {
                      // Use FileReader to get file

                      var reader = new FileReader();
                      
                      // Create a preview once image has loaded
                      reader.onload = function(e) {
                          var preview = create_preview(that, e.target.result, settings);
                      
                          $(that).html(preview);
                      }
                      // Load image
                      reader.readAsDataURL(picker_btn_input.prop('files')[0]);
                  }                
              });

              return picker_btn
          };
          
          // Private function for creating a preview element
          function create_preview(that, src, settings) {
              
                  // The preview image
                  var picker_preview_image = $('<img src="'+src+'" class="img-responsive img-rounded" />');
                  var picker_preview_remove = $('<button class="btn btn-link"><small>Remove</small></button>');
                  // The preview element
                  var picker_preview = $('<div class="text-center"></div>')
                      .append(picker_preview_image)
                      .append(picker_preview_remove);
                  var picker_btn_input = $(that).find( "input" );    
                  if(typeof picker_btn_input !== 'undefined') {
                      if(!picker_btn_input.is(":visible")) {
                        var picker_btn_input = $('<input name="'+settings.name+'" />');
                        picker_btn_input.css("visibility", "hidden");
                        picker_btn_input.val(src);
                        picker_preview.append(picker_btn_input);
                      }
                      else {
                        picker_btn_input.css("visibility", "hidden");
                        picker_preview.append(picker_btn_input); 
                      }
                  }
                  
                  // Remove image listener
                  picker_preview_remove.click(function() {
                      var btn = create_btn(that, settings);
                      $(that).html(btn);
                  });
                  return picker_preview;
          };

    
}( jQuery ));
 
});

