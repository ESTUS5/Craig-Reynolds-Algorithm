function createSlider(slider, boundTextField,min_,max_,value_) {
                slider.slider({
                    orientation: "horizontal",
                    range: "min",
                    step: 0.01,
                    min: min_,
                    max: max_,
                    value: value_,
                    slide: function( event, ui ) {
                        boundTextField.val( ui.value );
                    }
                })
            }