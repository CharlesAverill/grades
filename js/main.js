import Class from "./Class.js";
import Category from "./Category.js";
import Assignment from "./Assignment.js";

const classContainer = document.getElementById("classContainer");
var classes = [];
var classIndex = 0;

function findClass(className) {
	for(var i = 0; i < classIndex; i++){
		if(classes[i].internalName == className){
			return classes[i];
		}
	}
	return null;
}

function findClassAndCategory(elementID) {
	var split = elementID.split("_");
	var className = split[0];
	var catName = split[1];

	var foundClass = findClass(className);
	if(foundClass == null){
		alert("Couldn't find class with internal name " + className);
		return;
	}

	return [foundClass, foundClass.findCategory(catName)];
}

function editTextContent(element){
	var newName = prompt("Enter an alphanumeric name:", element.textContent);
	if(newName != null){
		findClass(element.parentNode.parentNode.id).displayName = newName.replace(" ", "_");
		element.textContent = newName.replace(" ", "_");
	}
}

function updateCatWeight(category){
	var found = findClassAndCategory(category);

}

function addAssignment(element){
	var foundCat = findClassAndCategory(element.id)[1];
	foundCat.addAssignment(new Assignment());
}

function removeAssignment(element){
	var foundClassCat = findClassAndCategory(element.id);
	foundClassCat[1].removeLastAssignment();
	foundClassCat[0].updateAverage();
}

function updateAssignment(element, newVal, mode){
	var parentElementId = element.parentNode.parentNode.id;

	var foundClassCat = findClassAndCategory(parentElementId);
	foundClassCat[1].updateAssignment(parentElementId, newVal, mode);
	foundClassCat[0].updateAverage();
}

function addCategory(classID){

}

function removeCategory(classID){

}

function addClass(){
	var newClass = new Class("Class " + (classIndex++ + 1), classIndex);
	classes.push(newClass);
	classContainer.insertAdjacentHTML("beforeend", newClass.repr());
}

function removeClass(){
	if(classes.length <= 1){
		return;
	}

	var toRemove = document.getElementById(classes[classes.length - 1].internalName);
	toRemove.parentNode.removeChild(toRemove);
}

function initBlank(){
	addClass();
	addClass();
}

function saveToJSON(){
	var classesDicts = [];
	classes.forEach(cl => classesDicts.push(cl.dict()));

	var out = JSON.stringify({"classes": classesDicts}, null, "\t");

	console.log(out);

	var downloadElement = document.getElementById("downloadAsJSON");
	downloadElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(out));
	downloadElement.setAttribute('download', "grades.json");

	downloadElement.click();
}

async function loadFromJSON(event) {
	const file = event.target.files.item(0)
	const text = await file.text();

	classes = [];
	classContainer.innerHTML = "";

	var classesDicts = JSON.parse(text)["classes"];
	for(var i = 0; i < classesDicts.length; i++){
		var tempClass = new Class();
		tempClass.fromDict(classesDicts[i]);

		classes.push(tempClass);
		classContainer.insertAdjacentHTML("beforeend", tempClass.repr());
	}
}

window.editTextContent = editTextContent;
window.updateCatWeight = updateCatWeight;

window.addAssignment = addAssignment;
window.removeAssignment = removeAssignment;
window.updateAssignment = updateAssignment;

window.addCategory = addCategory;
window.removeCategory = removeCategory;

window.addClass = addClass;
window.removeClass = removeClass;

window.saveToJSON = saveToJSON;
window.loadFromJSON = loadFromJSON;

initBlank();
