// Initialize Firebase
var config = {
    apiKey: "AIzaSyBMRFD4PHgQejFXwW7dRytX1IymbtAawFU",
    authDomain: "first-database-8377b.firebaseapp.com",
    databaseURL: "https://first-database-8377b.firebaseio.com",
    projectId: "first-database-8377b",
    storageBucket: "first-database-8377b.appspot.com",
    messagingSenderId: "862983536564"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#clearForm").on("click", function (event) {
    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#trainTime").val("");
    $("#trainRate").val("");
});


$("#addTrain").on("click", function (event) {
    event.preventDefault();

    var name = $("#trainName").val().trim();
    var destination = $("#trainDestination").val().trim();
    var firstTime = $("#trainTime").val().trim();
    var frequency = $("#trainRate").val().trim();

    function validateForm() {
        if (name === "" || destination === "" || firstTime === "" || frequency === "") {
            alert("Please complete the missing field(s).");
            return;
        } else {
            var newTrain = {
                name: name,
                destination: destination,
                firstTime: firstTime,
                frequency: frequency
            }

            database.ref("/trainSchedule").push(newTrain);
            $("#trainName").val("");
            $("#trainDestination").val("");
            $("#trainTime").val("");
            $("#trainRate").val("");

        }
    }

    validateForm();

});

database.ref("/trainSchedule").on("child_added", function (input) {

    var currentTime = moment();
    var firstTimeRecall = moment(input.val().firstTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeRecall), "minutes");
    var tRemainder = diffTime % input.val().frequency;
    var tTill = input.val().frequency - tRemainder;
    var nextTrain = moment().add(tTill, "minutes").format("hh:mm a");
    console.log(diffTime);
    console.log(input.val().firstTime);

    var newRow = $("<tr>").append(
        $("<td>").text(input.val().name),
        $("<td>").text(input.val().destination),
        $("<td>").text(input.val().frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(tTill)

    );

    $(".table").append(newRow);
});