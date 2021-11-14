import Category from "./Category.js";

export default class Class {
    displayName = "";
    internalName = "";
    categories = [];

    categoryIndex = 0;

    constructor(name, index, categories=null) {
        this.displayName = name.replace(" ", "_");
        this.internalName = "class" + index;
        if(categories == null){
            this.addCategoryWithoutDraw(new Category("Exams", null, 0.6, this.internalName));
            this.addCategoryWithoutDraw(new Category("Homework", null, 0.3, this.internalName));
            this.addCategoryWithoutDraw(new Category("Participation", null, 0.1, this.internalName));
        } else {
            this.categories = categories;
        }
    }

    addCategoryWithoutDraw(category){
        category.setIndex(this.categoryIndex++);
        this.categories.push(category);
    }

    addCategory(){
        var newCat = new Category("Category " + (this.categoryIndex++ + 1), null, 0.0, this.internalName);
        newCat.setIndex(this.categoryIndex);

        var lastCategory = this.categories[this.categories.length - 1];
        var appendElement = document.getElementById(lastCategory.internalName);

        this.categories.push(newCat);

        appendElement.insertAdjacentHTML("afterend", newCat.repr());
    }

    removeLastCategory(){
        if(this.categories.length <= 1){
            return;
        }

        var toRemove = document.getElementById(this.categories.pop().internalName);
        toRemove.parentNode.removeChild(toRemove);
    }

    findCategory(categoryTag){
        for(var i = 0; i < this.categoryIndex; i++){
            if(this.categories[i].internalName == this.internalName + "_" + categoryTag){
                return this.categories[i];
            }
        }
        return null;
    }

    get average(){
        var out = 0;
        this.categories.forEach(category => out += category.weightedAverage);
        return out;
    }

    updateAverage(){
        var replaceElement = document.getElementById(this.internalName + "_average");
        replaceElement.innerHTML = this.average;
    }

    repr() {
        var out = `
<div id="${this.internalName}">
    <details open>
    	<summary>
            <i class="icon icon-pencil class" onclick="editTextContent(this)"> ${this.displayName}</i>
                - <strong  id="${this.internalName}_average">${this.average}</strong>
        </summary>

        <br>

        <form id="${this.internalName}_categoryUpdate">
            <p>
                <input type="button" value="Add Category" onclick="addCategory('${this.internalName}')"></input>
                <input type="button" value="Remove Category" onclick="removeCategory('${this.internalName}')"></input>
            </p>
        </form>`;

        this.categories.forEach(category => out += category.repr() + "\n");

        out += `\n
    </details>

    <hr>

<div>\n`

        return out;
    }

    dict() {
        var categoriesArray = [];
        this.categories.forEach(category => categoriesArray.push(category.dict()));

        return {
            "displayName": this.displayName,
            "internalName": this.internalName,
            "categories": categoriesArray,
            "categoryIndex": this.categoryIndex
        };
    }

    fromDict(dict) {
        this.displayName = dict["displayName"];
        this.internalName = dict["internalName"];

        this.categories = [];
        for(var i = 0; i < dict["categories"].length; i++){
            var tempCategory = new Category();
            tempCategory.fromDict(dict["categories"][i]);
            this.categories.push(tempCategory);
        }

        this.categoryIndex = dict["categoryIndex"];
    }
}
