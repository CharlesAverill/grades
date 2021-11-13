import Category from "./Category.js";

export default class Class {
    displayName = "";
    internalName = "";
    categories = [];

    categoryIndex = 0;

    constructor(name, index, categories=null) {
        this.displayName = name;
        this.internalName = "class" + index;
        if(categories == null){
            this.addCategory(new Category("Exams", null, 0.6, this.internalName));
            this.addCategory(new Category("Homework", null, 0.3, this.internalName));
            this.addCategory(new Category("Participation", null, 0.1, this.internalName));
        } else {
            this.categories = categories;
        }
    }

    addCategory(category){
        category.setIndex(this.categoryIndex++);
        this.categories.push(category);
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
	<h2><i class="icon icon-edit class" onclick="editTextContent(this)"> ${this.displayName}</i></h2>`;

        this.categories.forEach(category => out += category.repr() + "\n");

        out += `\n
    <h2>Class Average: <span id="${this.internalName}_average">${this.average}</span></h2>
</div>\n`

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
