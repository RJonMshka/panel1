
import { Dispatcher, Store } from './flux';

const controlPanelDispatcher = new Dispatcher();

export const NOMINATE_SELF = `NOMINATE_SELF`;

const nominateSelfAction = (data)=>{
    return {
        "value":data,
        "type":NOMINATE_SELF
    }
}

$(function(){

    class PanelistStore extends Store {
        constructor(dispatcher){
            super(dispatcher);
            this.getInitialState().done(res => this.__state = res);
        }

        // Ajax call to Database (JSON-server  ,yet)
        getInitialState() {
            return $.ajax({
                url:"http://localhost:3003/panelists",
                method:'get',
                contentType:"application/json",
            });
        }

        __onDispatch(action){
            switch(action.type) {
                case NOMINATE_SELF:
                    this.__state = action.value;
                    $.ajax({
                        url: 'http://localhost:3003/panelists',
                        method:'put',
                        contentType:'application/json',
                        data: JSON.stringify(this.__state),
                        success: (res) => {
                            console.log('res is: '+res);
                            this.__emitChange();
                        }
                    });

                    break;
            }
        }

        getUserData(){
            return new Promise((resolve,reject) => {
                if(this.__state) {
                    resolve(this.__state);
                }
            });
        }
    }
    
    const panelistStore = new PanelistStore(controlPanelDispatcher);
    
    const render = (object)=>{
        console.log('render function');

        $('.collapse-button').on('click',function(e){
            $(e.currentTarget).find('.more-less').toggleClass("fa-plus fa-minus");
        });

        $('.logged-in-username').html(object.name.split(' ')[0]);
        $('.assessment-status').html(object.status);
        $('.nominated-by').html(object.nominatedBy);
        $('.nominate-btn').hide();
        $('.collapse-button').hide();
        $('.shadow-status').html(object.shadow.status);
        $('.reverse-shadow-status').html(object.reverseShadow.status);

        if(object.state == 0) {
            
            $('.detail-status').addClass('opacity');
            $('.nominate-btn').show();
        }

        $('.nominate-btn').on('click',() => {

            // Code for Email to Supervisor Will be here
            let newObject = object;
            newObject.state = 1;
            newObject.status = 'Pending Supervisor Approval';
            newObject.nominatedBy = 'Self';
            
            controlPanelDispatcher.dispatch(nominateSelfAction(newObject));

            $('#myModal').modal('show');
        });

        if(object.state == 1) {

            $('.detail-status').removeClass('opacity');
            $('.panel-group').find('.detail-status').addClass('opacity');

        }

        if(object.state == 2 || object.state == 3) {

            $('.detail-status').removeClass('opacity');
            $('.collapse-button').show();
            $('.shadow-required').html(object.shadow.numRequired);
            $('.shadow-status').html(object.shadow.status);
            $('.rev-shadow-required').html(object.reverseShadow.numRequired);
            $('reverse-shadow-status').html(object.reverseShadow.status);

            // Appending sections to Drop-Downs

            object.shadow.details.forEach((item) => {
                let $cloneContainer = $('.original-item').clone();
                $cloneContainer.removeClass('original-item').addClass('d-inline-flex');

                $cloneContainer.find('.assignee-name').html(item.assignedTo);
                $cloneContainer.find('.assigned-status').html(item.status);
                $cloneContainer.find('.date-completed').html(item.dateCompleted);

                $('#shadow-details').find('header').after($cloneContainer);
            });

            object.reverseShadow.details.forEach((item) => {
                let $cloneContainer = $('.original-item').clone();
                $cloneContainer.removeClass('original-item').addClass('d-inline-flex');

                $cloneContainer.find('.assignee-name').html(item.assignedTo);
                $cloneContainer.find('.assigned-status').html(item.status);
                $cloneContainer.find('.date-completed').html(item.dateCompleted);

                $('#reverse-shadow-details').find('header').after($cloneContainer);
            });
        }

    }
    panelistStore.addListener((state)=>{
        console.log('render is performed');
    
        // Re-render
        render(state);
    });

    panelistStore.getUserData().then( (data) => render(data) );

});



