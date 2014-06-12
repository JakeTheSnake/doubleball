GameCreator.TopDownObject.prototype.getTabs = function() {
        return  '<a class="tab dialogue-window-tab" data-uifunction="setupCollisionsForm">Collisions</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupKeyEventsForm">Keys</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupOnClickActionsForm">On click</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupCountersForm">Counters</a>';
};

GameCreator.TopDownObject.prototype.getStateForm = function(stateId) {
    return 'CONTENT FOR STATE ' + stateId;
};

