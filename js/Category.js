import Assignment from "./Assignment.js";

export default class Category {
    displayName = "";
    internalName = "";
    assignments = [];
    weight = 0.0;
    className = "unknown";
    _average = 0.0;

    assignmentIndex = 0;

    constructor(displayName, assignments=null, weight=null, className=null) {
        this.displayName = displayName;
        this.internalName = "catnull";

        if(weight != null){
            this.weight = weight;
        }
        if(className != null){
            this.className = className;
        }

        if(assignments != null){
            this.assignments = assignments;
        } else {
            this.addAssignment(new Assignment(), false);
        }
    }

    findAssignment(assignmentID){
        for(var i = 0; i < this.assignments.length; i++){
            if(this.assignments[i].id == assignmentID){
                return this.assignments[i];
            }
        }

        return null;
    }

    addAssignment(assignment, draw=true) {
        var appendElement;

        assignment.categoryName = this.internalName;

        assignment.index = this.assignmentIndex++;

        if(draw){
            if(this.assignments.length > 0){
                var lastAssignment = this.assignments[this.assignments.length - 1];
                appendElement = document.getElementById(lastAssignment.id);
            } else {
                appendElement = document.getElementById(this.internalName);
            }

            appendElement.insertAdjacentHTML("afterend", assignment.repr());
        }

        this.assignments.push(assignment);
    }

    removeLastAssignment() {
        if(this.assignments.length <= 1){
            return;
        }
        
        var lastAssignment = this.assignments.pop();
        var removeElement = document.getElementById(lastAssignment.id);

        removeElement.parentNode.removeChild(removeElement);

        this._average = 0.0;
        document.getElementById(this.internalName + "_average").innerHTML = this.average;
    }

    updateAssignment(elementID, newVal, mode) {
        var assignment = this.findAssignment(elementID);

        this._average = 0.0;

        if(assignment != null){
            if(mode == "name"){
                assignment.name = newVal;
            } else {
                if(typeof newVal === "string"){
                    var parsed = parseFloat(newVal);
                    assignment.grade = isNaN(parsed) ? 0 : parsed;
                } else {
                    assignment.grade = newVal;
                }
                document.getElementById(this.internalName + "_average").innerHTML = this.average;
            }
        }
    }

    setIndex(val) {
        this.internalName = this.className + "_cat" + val;
        this.assignments.forEach(assignment => assignment.categoryName = this.internalName);
    }

    get assignments() {
        var out = "";
        this.assignments.forEach(assignment => out += assignment.repr() + "\n");
        return out;
    }

    get average() {
        if(this._average == 0.0){
            this.assignments.forEach(assignment => assignment.grade ? this._average += assignment.grade : 0);
            this._average /= this.assignments.length;

            this._average = this._average.toFixed(2);
        }

        return this._average;
    }

    get weightedAverage() {
        return this.average * this.weight;
    }

    repr() {
        var out = `
<div id="${this.internalName}" class="indent_element">
    <h3><i class="icon icon-pencil category" onclick="editTextContent(this)"> ${this.displayName}</i></h3>

    <label for="${this.internalName}_weight">Category Weight:</label>
    <input type="number" step="0.1" name="${this.internalName}_weight" value="${this.weight}" onkeyup="updateCatWeight('${this.internalName}')">

    <table>
        <input type="button" value="Add row" onclick="addAssignment(${this.internalName})">
        <input type="button" value="Remove row" class="inline_block" onclick="removeAssignment(${this.internalName})">
        <tr>
            <th>Name</th>
            <th>Grade (%)</th>
            <!--<th>Custom Weight</th>-->
        </tr>`;

        this.assignments.forEach(assignment => out += assignment.repr() + "\n");

        out += `
        <tr>
                <th>Average</th>
                <th id=${this.internalName}_average>${this._average}</th>
                <!--<th></th>-->
        </tr>
    </table>
</div>`;

        return out;
    }

    dict() {
        var assignmentsArray = [];
        this.assignments.forEach(assignment => assignmentsArray.push(assignment.dict()));

        return {
            "displayName": this.displayName,
            "internalName": this.internalName,
            "assignments": assignmentsArray,
            "weight": this.weight,
            "className": this.className,
            "_average": this._average,
            "assignmentIndex": this.assignmentIndex
        };
    }

    fromDict(dict) {
        this.displayName = dict["displayName"];
        this.internalName = dict["internalName"];

        this.assignments = [];
        for(var i = 0; i < dict["assignments"].length; i++){
            var tempAssignment = new Assignment();
            tempAssignment.fromDict(dict["assignments"][i]);
            this.assignments.push(tempAssignment);
        }

        this.weight = dict["weight"];
        this.className = dict["className"];
        this._average = dict["_average"];
        this.assignmentIndex = dict["assignmentIndex"];
    }
}
