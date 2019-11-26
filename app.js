// BUDGET Controller

const budgetController = (function(){

    let Expense = function(id, description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {

        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }

    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    let Income = function (id, description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = function(type) {
        let sum = 0;

        data.allItems[type].forEach(e => {
            sum = e.value + sum;
        })

        data.totals[type] = sum;

    };

    const data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
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
        },

        deleteItem: function(type, id){
            let ids, index;

            ids = data.allItems[type].map( e => {
                return e.id;
            });

            index = ids.indexOf(id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function(){

            // calculate total income and expenses

            calculateTotal('exp');
            calculateTotal('inc');
    
            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        },

        calculatePercentages: function(){

            data.allItems.exp.forEach(e => {
                e.calcPercentage(data.totals.inc);
            })

        },

        getPercentage: function() {
            let allPerc;

            allPerc = data.allItems.exp.map(e => {
                return e.getPercentage();
            })
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage, 
            }
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    };


    const formatNumber = function(num, type){
        let numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0];

        if(int.length > 3) {
           int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        dec = numSplit[1];

        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;

    };

    let nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
        },

        addListItem: function(obj, type) {
            let html, newHtml, element;
            
            // create HTML string with placeholder text
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            
            // replace the placeholder text with some actual data
            
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        deleteListItem: function(selectorID){

            let el;

            el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);

        },

        clearFields: function() {
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(e => {
                e.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){

            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exc';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }

        },
        
        displayPercentages: function(percentages) {

            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


            nodeListForEach(fields, function(current, index) {

                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%'
                } else {
                    current.textContent = '---'
                }
                
            });

        },

        displayMonth: function(){
            let now, year, month, months;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        changedType: function() {

            let fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };



    const updateBudget = function() {
        
        // 1. calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        let budget = budgetCtrl.getBudget();
        // 3. display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    const updatePercentages = function() {
        // calculate percentages
        budgetCtrl.calculatePercentages();

        // read percentages from the budget controller
        let percentages = budgetCtrl.getPercentage();

        // update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    }

    const ctrlAddItem = function(){
        let input, newItem;

        // 1. get filled input data
        input = UICtrl.getinput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

        // 2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
    
        // 3. add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. clear the fields

        UICtrl.clearFields();

        // 5. calculate and update budget
        updateBudget();

        // 6. calculate and update percentages

        updatePercentages();

        }
        
    },

    ctrlDeleteItem = function(event){
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.deleteItem(type, ID);

            UICtrl.deleteListItem(itemID);

            updateBudget();

            updatePercentages();


        }

       

    }


    return {
        init: function() {
            console.log('Application has started!');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1, 
            }),
            setupEventListeners();
        }
    };
    

})(budgetController,UIController)

controller.init();