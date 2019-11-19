// BUDGET Controller

const budgetController = (function(){

    

})();


// UI Controller

const UIController = (function() {

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    }

    
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();

// Global APP Controller

const controller = (function(budgetCtrl, UICtrl) {

    

    const setupEventListeners = function() {

        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem)

        document.addEventListener('keydown', function(e){

            if(e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };

    const ctrlAddItem = function(){
        // 1. get filled input data
        let input = UICtrl.getinput();
        console.log(input);
        // 2. add the item to the budget controller

        // 3. add the item to the UI

        // 4. calculate the budget

        // 5. display the budget on the UI
    };


    return {
        init: function() {
            console.log('Application has started!');
            setupEventListeners();
        }
    };
    

})(budgetController,UIController)

controller.init();