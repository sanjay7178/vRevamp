let modify_marks_page = () => {
    
    let tables = document.querySelectorAll(".customTable-level1 > tbody"); // select all Tables
    let subject_header = Array.from(document.querySelectorAll(".tableContent"));
    let i = 0;
    tables.forEach((table) => {

        // To get the subject code
        let sub_header_row = subject_header[i].getElementsByTagName("td");
        let sub_type = sub_header_row[4].innerHTML;
        let sub_type1 = sub_header_row[2].innerHTML;
        i += 2;
        let tot_max_marks = 0,
            tot_weightage_percent = 0,
            tot_scored = 0,
            tot_weightage_equi = 0,
            tot_class_avg = 0;
            tot_cat_fat = 0;
            max_marks_cat_fat =0;

        table_marks = table.querySelectorAll(".tableContent-level1"); // select rows excluding header
        table_marks = Array.from(table_marks);

        table_marks.forEach((row) => {

            let content = row.innerHTML.split("<td>");

            //Removing the tabs and other tags
            let cat_fat =  content[2].replace('<output>', '').replace('</output></td>', '');
            // console.log(cat_fat)
            let max_marks = content[3].replace(/[^0-9.]+/g, "");
            let weightage_percent = content[4].replace(/[^0-9.]+/g, "");
            let scored = content[6].replace(/[^0-9.]+/g, "");
            let weightage_equi = content[7].replace(/[^0-9.]+/g, "");
            let class_avg = content[8].replace(/[^0-9.]+/g, "");
            // console.log(cat_fat.match(/CAT/).includes("CAT"));
            // console.log(scored);
            // cat + fat 
            if(cat_fat.match(/CAT/) =='CAT'){
                tot_cat_fat += parseFloat(scored)
                max_marks_cat_fat +=parseFloat(max_marks)
            }else if (cat_fat.match(/FAT/) =='FAT') {
                tot_cat_fat += parseFloat(scored)
                max_marks_cat_fat +=parseFloat(max_marks)
            }else if (cat_fat.match(/CAT1/) =='CAT1'){
                tot_cat_fat += parseFloat(scored)
                max_marks_cat_fat +=parseFloat(max_marks)
            }else if(cat_fat.match(/CAT2/) =='CAT2'){
                tot_cat_fat += parseFloat(scored)
                max_marks_cat_fat +=parseFloat(max_marks)
            }

            //converting string to float
            tot_max_marks += parseFloat(max_marks);
            tot_weightage_percent += parseFloat(weightage_percent);
            tot_scored += parseFloat(scored);
            tot_weightage_equi += parseFloat(weightage_equi);
            tot_class_avg += parseFloat(class_avg);

            
        });

        //Add the row to display totals
        table.innerHTML += `
        <tr class="tableContent-level1" style='background: rgb(60,141,188,0.8);'>
            <td></td>
            <td><b>Total:</b></td>
            <td>${tot_max_marks.toFixed(2)}</td>
            <td>${tot_weightage_percent.toFixed(2)}</td>
            <td></td>
            <td><b>${tot_scored.toFixed(2)}</b></td>
            <td><b>${tot_weightage_equi.toFixed(2)}</b></td>
            <td>${tot_class_avg.toFixed(2)}</td>
            <td><b>Lost Weightage Marks:</b></td>
            <td>${(tot_weightage_percent.toFixed(2) - tot_weightage_equi.toFixed(2)).toFixed(2)}</td>
        </tr>
        `;

        //FAT passing marks
        let pass_marks;

        //Theorey Subjects
        // if ((sub_type.includes("Theory") && tot_weightage_percent == 75 )) {
        //     if (tot_cat_fat >= 44) {
        //         pass_marks = 44;
        //         table.innerHTML += `
        //         <tr class="tableContent-level1" style='background: rgb(170, 255, 0,0.6);'>
        //             <td colspan="10" style="text-align:center">You secured in CAT+FAT : ${tot_cat_fat}</td>
        //         </tr>
        //         <tr class="tableContent-level1" style='background: rgb(170, 255, 0,0.6);'>
        //             <td colspan="10" style="text-align:center">You need only ${pass_marks} marks out of ${max_marks_cat_fat} in CAT + FAT to pass theory component 🥳</td>
        //         </tr>

        //         `;
        //     }
        //     else {
        //         pass_marks = 45 - tot_cat_fat ;
        //         max_pass_marks =  max_marks_cat_fat  -45 ;
        //         table.innerHTML += `
        //         <tr class="tableContent-level1" style='background: rgb(255,0,0,0.6);'>
        //             <td colspan="10" style="text-align:center"><b>Minimum marks required to clear this component is : ${pass_marks.toFixed(2)} and max marks are  ${max_pass_marks}<b></td>
        //         </tr>
        //         `;
        //     }
        // }
        // Theory Only Subjects
        // if (sub_type.includes("Only")) {
        //     if (tot_cat_fat >= 44) {
        //         pass_marks = 44;
        //         table.innerHTML += `
        //         <tr class="tableContent-level1" style='background: rgb(170, 255, 0,0.6);'>
        //             <td colspan="10" style="text-align:center">You secured in CAT+FAT : ${tot_cat_fat}</td>
        //         </tr>
        //         <tr class="tableContent-level1" style='background: rgb(170, 255, 0,0.6);'>
        //             <td colspan="10" style="text-align:center">You need only ${pass_marks} marks out of ${max_marks_cat_fat} in CAT + FAT to pass theory component 🥳</td>
        //         </tr>

        //         `;
        //     }
        //     else {
        //         pass_marks = 45 - tot_cat_fat ;
        //         max_pass_marks =  max_marks_cat_fat  -45 ;
        //         table.innerHTML += `
        //         <tr class="tableContent-level1" style='background: rgb(255,0,0,0.6);'>
        //             <td colspan="10" style="text-align:center"><b>Minimum marks required to clear this component is : ${pass_marks.toFixed(2)} and max marks are  ${max_pass_marks}<b></td>
        //         </tr>
        //         `;
        //     }
        // }
        //Labs
        // else if ((sub_type.includes("Lab") || sub_type.includes("Online")) ) {
        //     if (tot_weightage_equi >= 50) {
        //         pass_marks = "You have fulfilled the criteria of passing the Lab Component 🥳"
        //         table.innerHTML += `
        //         <tr class="tableContent-level1" style='background: rgb(170, 255, 0,0.6);'>
        //             <td colspan="10" style="text-align:center">${pass_marks}</td>
        //         </tr>
        //         `;
        //     }
        //     else {
        //         pass_marks = 50 - tot_weightage_equi;
        //         table.innerHTML += `
        //         <tr class="tableContent-level1" style='background: rgb(255,0,0,0.6);'>
        //             <td colspan="10" style="text-align:center"><b>Minimum marks required to clear this component is : ${pass_marks.toFixed(2)}<b></td>
        //         </tr>
        //         `;
        //     }
        // }

        //STS
        // else if (sub_type1.includes("STS")) {
        //     if (tot_weightage_equi >= 50) {
        //         pass_marks = "You have fulfilled the criteria of passing the STS 🥳"
        //         table.innerHTML += `
        //         <tr class="tableContent-level1" style='background: rgb(170, 255, 0,0.6);'>
        //             <td colspan="10" style="text-align:center">${pass_marks}</td>
        //         </tr>
        //         `;
        //     }
        //     else {
        //         pass_marks = 50 - tot_weightage_equi;
        //         table.innerHTML += `
        //         <tr class="tableContent-level1" style='background: rgb(255,0,0,0.6);'>
        //             <td colspan="10" style="text-align:center"><b>Minimum marks required to clear STS is : ${pass_marks.toFixed(2)} marks<b></td>
        //         </tr>
        //         `;
        //     }
        // }
    });
}
chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "mark_view_page") {
        try {
            modify_marks_page();
            saveMarksPage(document.querySelector(".box-body").outerHTML);
        } catch (error) {
            console.error(error);
        }
    }
});
