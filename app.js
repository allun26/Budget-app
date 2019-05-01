// BUDGET CONTROLLER MODULE
let budgetController = (function(){
    //construct expense object
    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    //construct income object
    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    // function to calculate total exp and inc
    let = calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.total[type] = sum;
    }
    
    //Object to store all data, income and expenses
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1  
    };

    return {
        addItem: function(type, des, val){
            let newItem;
            //Create new ID
            if (data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            //push it into our data structure
            data.allItems[type].push(newItem);
            //Return the new element
            return newItem;
        },
        //method to delete an item from the allitems object
        deleteItem: function(type, id){
            let ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function(){

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expenses
            data.budget = data.total.inc - data.total.exp;

            //calculate the % of income that we spent
            if (data.total.inc > 0){
            data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function(){
            
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.total.inc);
            
            });
         },

         getPercentages: function(){
            let allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
         },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        },
        testing: function() {
            console.log(data);
        }
    };

})();


// UI CONTROLLER MODULE
let UIController = (function(){

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBTN: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    //Function to format the numbers to make it look nicer
    let formatNumber = function(num, type){
        let numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0];
        if (int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        type === 'exp' ? sign = '-' : sign = '+';

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
    //ForEach function to use on a nodelist
    let nodeListForEach = function(list, callback){
        for (let i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };

    return{
    // function to get the input and return it
        getInput: function(){ 
            return {
                type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            }
        },
        //method to add item to the DOM
        addListItem: function(obj, type){
            //create Html string with placeholder text
            let html, newHtml, element;
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            //insert the Html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        //method to delete item from the DOM
        deleteListItem: function(selectorID){
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        // clear the input fields after confirming the input
        clearFields: function(){
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            //call the slice method from the Array object on the fields nodelist
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            //sets the focus to the first input box after confirming
            fieldsArr[0].focus();
        },
        //Function to display the total budget in the DOM
        displayBudget: function(obj){
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            

            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage +'%';
            } else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'   
            }

        },
        
        //method to display percentages for each item in the DOM
        displayPercentages: function(percentages){

            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index){

                if (percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            })


        },
        
        // Method to display the correct month of the year
        displayMonth: function() {
            let now, year, month, months;
            
            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;


        },
        //Method to change style on input fields when changing input type
        changedType: function(){
            let fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + 
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
            
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBTN).classList.toggle('red');
            
        },

        // return the DOMstrings object so we can use it in the other modules
        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();


//GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = function(){
        let DOM = UICtrl.getDOMstrings(); // get the DOMstrings object
        //add item 
        document.querySelector(DOM.inputBTN).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem(); 
            }
        });
        //delete item
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

        //change color when changing from inc to exp and visa versa
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
        
        //function to update the budget
        let updateBudget = function (){
            //calculate the budget
            budgetCtrl.calculateBudget();

            //return the budget
            let budget = budgetController.getBudget();

            //display the budget on the UI
            UICtrl.displayBudget(budget);
        };
        
        //function to update and calculate the percentages
        let updatePercentages = function(){
            //calculate percentages
            budgetCtrl.calculatePercentages();

            //read percentages from the budget controller
            let percentages = budgetCtrl.getPercentages();

            //update the UI with the new percentages
            UICtrl.displayPercentages(percentages);

        };

        let ctrlAddItem = function() {
            let input, newItem;
        
            //1. get the field input data
            input = UIController.getInput();
            // makes sure you cannot input empty strings and NaN
            if (input.description !== "" && !isNaN(input.value) && input.value > 0){

                //2. add the item to the budget controller
                newItem = budgetController.addItem(input.type, input.description, input.value);
           
                //3. Add the item to the UI
                UICtrl.addListItem(newItem, input.type);
            
                //4. clear the input fields after confirming
                UICtrl.clearFields();

                //5. calculate and update budget
                updateBudget();

                //6. update and calculate percentages
                updatePercentages();
            }
    };
    //function to delete an item when the delete icon is pressed
    let ctrlDeleteItem = function(event){
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID){

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete the item from the data structure
            budgetController.deleteItem(type, ID);

            //delete the item from the user interface
            UICtrl.deleteListItem(itemID);

            //update and show the new budget
            updateBudget();
            
            //update and calculate percentages
            updatePercentages();
        }
    };

    return {
        init: function() {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();