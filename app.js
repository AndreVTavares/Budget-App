// BUDGET Controller

const budgetController = (function(){

    let Expense = function(id, description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Income = function (id, description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    const data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        }
    }

    return {
        addItem: function(type, des, val) {
            let newItem, ID;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            

            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val)
            }

            data.allItems[type].push(newItem);
            return newItem;
        }
    }

})();


// UI Controller

const UIController = (function() {

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    }

    
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }
        },

        addListItem: function(obj, type) {
            let html, newHtml, element;
            
            // create HTML string with placeholder text
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            
            // replace the placeholder text with some actual data
            
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        clearFields: function() {
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(e => {
                e.value = "";
            });
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
        let input, newItem;

        // 1. get filled input data
        input = UICtrl.getinput();
        
        // 2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
    
        // 3. add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. clear the fields

        UICtrl.clearFields();

        // 5. calculate the budget

        // 6. display the budget on the UI
    };


    return {
        init: function() {
            console.log('Application has started!');
            setupEventListeners();
        }
    };
    

})(budgetController,UIController)

controller.init();