$(document).ready(function () {
    $.getJSON("http://localhost:3000/states/fetchallstates", (data) => {
        // alert(JSON.stringify(data))
        if (data.status) {
            data.result.map(element => {
                $('#state').append($('<option>').text(element.name).val(element.id))
            })
            $('select').formSelect();
        }
        else {
            alert("server error")
        }
    })

    $('#state').change(() => {
        $.getJSON("http://localhost:3000/states/fetchallcities", { stateid: $('#state').val() }, (data) => {
            if (data.status) {
                $('#city').empty()
                data.result.map(element => {
                    $('#city').append($('<option>').text(element.city).val(element.id))
                })
                $('select').formSelect();
            }
            else {
                alert("server error")
            }
        })

    })
})