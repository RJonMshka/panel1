$(function(){
    //$('.more-less').toggleClass("fa-plus fa-minus");
    $('.collapse-button').on('click',function(e){
        $(e.currentTarget).find('.more-less').toggleClass("fa-plus fa-minus");
    });

    let render = function (count , $container , className , event ) {
        
        $(`.${className}`).remove();

        for (let i = 0 ; i < count ; i++) {

            let $tempContainer = $container.clone();

            $tempContainer.addClass(className);

            $(event.currentTarget).closest('header').after($tempContainer);

        }

        $container.remove();

    }

    $('#reverse-shadow-count').on('change',function(e){
        $('.shadow-details-brief').eq(0).removeClass('cloned-rs-containers').removeClass('cloned-s-containers').addClass('d-inline-flex');
        render( $(this).val() , $('.shadow-details-brief').eq(0) , 'cloned-rs-containers' , e );
    });

    $('#shadow-count').on('change',function(e){
        $('.shadow-details-brief').eq(0).removeClass('cloned-s-containers').removeClass('cloned-s-containers').addClass('d-inline-flex');
        render( $(this).val() , $('.shadow-details-brief').eq(0) , 'cloned-s-containers' , e );
    });

});