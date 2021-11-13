export default class Assignment {
	name = "";
	grade = 0.0;
	customWeight = 0.0;
    categoryName = "";

    index = -1;

	constructor(name="", grade=null, customWeight=null){
		this.name = name;
		this.grade = grade;
		this.customWeight = customWeight;
	}

	set name(val) {
        if(val == null){
            this.name = "";
        } else {
		    this.name = val;
        }
	}

	set grade(val) {
		this.grade = val;
	}

	set customWeight(val) {
		this.customWeight = val;
	}

    get id() {
        return `${this.categoryName}_assignment${this.index}`;
    }

	repr(){
		return `
<tr id="${this.id}">
	<td><input type="text" name="assignmentName" value="${this.name}" onkeyup="updateAssignment(this, this.value, 'name')"></td>
	<td><input type="number" name="assignmentGrade" step="0.1" value="${this.grade}" onkeyup="updateAssignment(this, this.value, 'grade')"></td>
	<!--<td><input type="number" name="assignmentCustomWeight" step="0.1" value="${this.customWeight}"></td>-->
</tr>`;
	}

    dict(){
        return {
            "name": this.name,
            "grade": this.grade,
            "customWeight": this.customWeight,
            "categoryName": this.categoryName,
            "index": this.index
        };
    }

    fromDict(dict) {
        this.name = dict["name"];
        this.grade = dict["grade"];
        this.customWeight = dict["customWeight"];
        this.categoryName = dict["categoryName"];
        this.index = dict["index"];
    }
}
