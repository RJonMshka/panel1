$(function(){
    //$('.more-less').toggleClass("fa-plus fa-minus");
    $('.collapse-button').on('click',function(e){
        $(e.currentTarget).find('.more-less').toggleClass("fa-plus fa-minus");
    });

    let renderAdd = function (itemIndex , $container , $clonedContainer , className) {
        let $tempContainer = $clonedContainer.clone();

        $tempContainer.removeClass('original-item').addClass('d-inline-flex');

        if(itemIndex === 0) {
            $container.find('header').after($tempContainer);
        }
        else {
            $container.find(`.${className}`).last().after($tempContainer);
        }

    }

    let renderRemove = function (itemIndex , $container , className) {
        $container.find(`.${className}`).last().remove();
    }

    class Render{
        constructor($container , $clonedContainer  , className){
            this.$container = $container;
            this.$clonedContainer = $clonedContainer;
            this.className = className;
            this.oldCount = 0;
            this.newCount;
        }

        addRemoveComponents(newCount){
            this.newCount = newCount;
            if(this.oldCount < this.newCount) {
                for(let i = this.oldCount ; i < this.newCount ; i++) {

                    renderAdd(i , this.$container , this.$clonedContainer , this.className);

                }
            }
            else if (this.newCount < this.oldCount) {
                for (let i = this.oldCount ; i> this.newCount ; i--) {

                    renderRemove(i , this.$container , this.className);

                }
            }
            this.oldCount = this.newCount;
        }

    }

    let ShadowRender = new Render($('#shadow-details') , $('.original-item') , 'shadow-details-brief');
    let ReverseShadowRender = new Render($('#reverse-shadow-details') , $('.original-item') , 'shadow-details-brief');

    $('#shadow-count').on('change', function () {
        ShadowRender.addRemoveComponents($(this).val());
    });

    $('#reverse-shadow-count').on('change' , function () {
        ReverseShadowRender.addRemoveComponents($(this).val());
    });

});