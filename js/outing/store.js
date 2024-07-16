/*<![CDATA[*/
/*jQuery(document).ready(function() {
			    // binds form submission and fields to the validation engine
			    jQuery("#outingForm").validationEngine('attach', {
			        //alert("hi");
			        autoHidePrompt : true,
			        binded : false,
			        onValidationComplete : function(form, status) {
			            alert("hi");
			            if (status) {
			                submitOutingForm();
			            }
			        }
			    });

			});*/

$("#outingDate").datepicker({
  autoClose: true,
  dateFormat: "dd-M-yy",
  minDate: "0",
  maxDate: "6",
  beforeShowDay: function (d) {
    var day = d.getDay();
    return [day != 2 && day != 3 && day != 4 && day != 5 && day != 6];
  },
});

/*
			function getOutTime(inTime){
			    alert(inTime);

			    var time = inTime.split(":");
			    var outTime = parseInt(time[0])+6;
			    //alert(outTime);
			    var res = outTime+":"+time[1];
			    alert(res);
			    document.getElementById("inTime").innerHTML = res;
			}
			 */

function submitOutingForm() {
  var form = document.getElementById("outingForm");
  var now = new Date();
  var fd = new FormData(form);
  var purposeOfVisit = document.getElementById("purposeOfVisit").value;

  if (purposeOfVisit == "") {
    alert("Please fill Purpose of visit");
    return false;
  }
  var outingDate = document.getElementById("outingDate").value;

  if (outingDate == "") {
    alert("Please fill Date");
    return false;
  }

  var contactNumber = document.getElementById("contactNumber").value;

  if (contactNumber == "") {
    alert("Please fill contact number");
    return false;
  }

  if (contactNumber.length < 10 || contactNumber.length > 10) {
    alert("Mobile No. is not valid, Please Enter 10 Digit Mobile No.");
    return false;
  }

  //var regNo = document.getElementById("regNo").value;
  var csrfName = "_csrf";
  var csrfValue = document.querySelector("#logoutForm1 > input[type=hidden]:nth-child(1)").value;
  fd.append(csrfName, csrfValue);
  //var date = document.getElementById("todayDate").value;
  //alert(regNo);
  //fd.append("logTimestamp",date);
  fd.append("x=", now.toUTCString());

  $.blockUI({
    message: '<img src="assets/img/482.GIF"> loading... Just a moment...',
  });

  $.ajax({
    url: "hostel/saveOutingForm",
    type: "POST",
    data: fd,
    cache: false,
    processData: false,
    contentType: false,
    success: function (response) {
      $.unblockUI();
      $("#main-section").html(response);
      //swal("Weekend Outing Applied Successfully", "", "success");
    },
    error: function (jqXHR, textStatus, errorMessage) {
      //alert("error");
      //swal("You have already applied for Outing this Weekend", "","error");
      $.unblockUI();
    },
  });
}

function getReport() {
  $.blockUI({
    message: '<img src="assets/img/482.GIF"> loading... Just a moment...',
  });

  //var year =$('select[name="year"]').val();
  //alert(year)
  //var authorizedID = document.getElementById("authorizedID").value;
  var now = new Date();

  var authorizedID = document.querySelector("#authorizedIDX").value;

  $.ajax({
    url: "hostel/downloadOutingForm",
    type: "POST",
    data: fd,
    success: function (response) {
      $.unblockUI();
      $("#main-section").html(response);
    },
    error: function (jqXHR, textStatus, errorMessage) {
      $.unblockUI();
      $("#upload-file-message").text(errorMessage + "Error while Addition");
    },
  });

  $("html, body").animate(
    {
      scrollTop: 0,
    },
    "slow"
  );
}

function downloadform() {
  var data = getnumber();

  document.getElementById("recieptLink").href = "downloadReciept/" + data;
}

//Update and Delete the form details

function updateBookingInfo(BookingId) {
  //alert(BookingId);

  var authorizedID = document.getElementById("authorizedID").value;
  var now = new Date();
  var csrfName = "_csrf";
  var csrfValue = document.querySelector("#logoutForm1 > input[type=hidden]:nth-child(1)").value;
  var id = document.querySelector("#authorizedIDX").value;

  (params =
    csrfName +
    "=" +
    csrfValue +
    "&BookingId=" +
    BookingId +
    "&authorizedID=" +
    authorizedID +
    "&x=" +
    now.toUTCString()),
    $.ajax({
      url: "hostel/updateBookingInfo",
      type: "POST",
      data: params,

      //For Progress Bar
      success: function (response) {
        $("#main-section").html(response);
        //swal("Weekend Outing Details Updated Successfully", "", "success");
      },
    });
}

function deleteStudentBookingInfo(BookingId) {
  //alert(BookingId);

  var authorizedID = document.getElementById("authorizedID").value;

  var now = new Date();

  var csrfName = "_csrf";
  var csrfValue = document.querySelector("#logoutForm1 > input[type=hidden]:nth-child(1)").value;
  var id = document.querySelector("#authorizedIDX").value;

  (params =
    csrfName +
    "=" +
    csrfValue +
    "&BookingId=" +
    BookingId +
    "&authorizedID=" +
    authorizedID +
    "&x=" +
    now.toUTCString()),
    $.ajax({
      url: "hostel/deleteBookingInfo",
      type: "POST",
      data: params,

      //For Progress Bar
      success: function (response) {
        $("#main-section").html(response);
        //swal("Deleted Details Successfully", "", "success");
      },
    });
}

/* $(document).ready(function () {
			    $('#BookingRequests').DataTable();
			}); */

/*]]>*/
