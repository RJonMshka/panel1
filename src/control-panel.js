
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
        getInitialState(cb) {
            $.ajax({
                url:"http://localhost:3003/panelists",
                method:'get',
                contentType:"application/json",
                success: (res)=> {
                    this.__state = res;
                    cb(this.__state);
                }
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
    }
    
    const panelistStore = new PanelistStore(controlPanelDispatcher);
    
    const render = (object)=>{

        $('.collapse-button').on('click',function(e){
            $(e.currentTarget).find('.more-less').toggleClass("fa-plus fa-minus");
        });

        $('.logged-in-username').html(object.name.split(' ')[0]);
        $('.assessment-status').html(object.status);
        $('.nominated-by').html(object.nominatedBy);
        $('.nominate-btn').hide();
        $('.shadow-status').html(object.shadow.status);
        $('.reverse-shadow-status').html(object.reverseShadow.status);

        if(object.state == 0) {
            
            $('.detail-status').css('opacity',0.6);
            $('.collapse-button').hide();
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

    }
    panelistStore.addListener((state)=>{
        console.log('render is performed');
    
        // Re-render
        render(state);
    });

    panelistStore.getInitialState((data)=>{render(data)});

});



