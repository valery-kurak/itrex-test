$(document).ready(function() {
  $('#myTable').DataTable( {
    stateSave: true,
    "pagingType": "full_numbers",
    lengthMenu: [ [10, 20, 30, -1], [10, 20, 30, "All"] ],
    pageLength: 20,
    initComplete: function () {
      this.api().columns().every( function () {
        var column = this;
        var select = $('<select class="select"><option value="">Filter by: </option></select>')
          .appendTo( $(column.footer()).empty() )
          .on( 'change', function () {
            var val = $.fn.dataTable.util.escapeRegex(
              $(this).val()
            );

            column
              .search( val ? '^'+val+'$' : '', true, false )
              .draw();
          } );

        column.data().unique().sort().each( function ( d, j ) {
          select.append( '<option value="'+d+'">'+d+'</option>' )
        } );
      } );
    }
  } );
} );

let myTable = document.querySelector('#myTable tbody');
let dataURL = "https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json";
var data = {}
var xhr = new XMLHttpRequest();
xhr.open('GET', dataURL, false);
xhr.send();
if (xhr.status != 200) {
  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
} else {
  data = xhr.responseText;
}

let dataAPI = JSON.parse(data);

myTable.innerHTML += dataAPI.map(n => `
  <tr>
    <td>${n.id}</td>
    <td>${n.firstName}</td>
    <td>${n.lastName}</td>
    <td>${n.email}</td>
    <td>${n.phone}</td>
    <td>${n.adress.state}</td>
  </tr>
`).join('');

let cells = document.querySelectorAll("#myTable td");
for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", function() {
    let clickedRow = this.innerHTML;
    let clickedElemUpd = jQuery.grep(dataAPI , function (element, index) { return element.id == clickedRow || element.firstName == clickedRow || element.lastName == clickedRow || element.email == clickedRow || element.phone == clickedRow || element.adress.state == clickedRow; });
    $('#selectedProfile').text(clickedElemUpd[0].firstName + ' ' + clickedElemUpd[0].lastName);
    $('#description').text(clickedElemUpd[0].description);
    $('#address').text(clickedElemUpd[0].adress.streetAddress);
    $('#city').text(clickedElemUpd[0].adress.city);
    $('#state').text(clickedElemUpd[0].adress.state);
    $('#index').text(clickedElemUpd[0].adress.zip);
  });
}