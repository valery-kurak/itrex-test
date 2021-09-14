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

let mySelect = document.getElementById("mySelect");

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

mySelect.innerHTML += dataAPI.map(n => `
  <option value="${n.adress.state}">${n.adress.state}</option>
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

document.addEventListener('DOMContentLoaded', () => {

  const getSort = ({ target }) => {
    const order = (target.dataset.order = -(target.dataset.order || -1));
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
    const comparator = (index, order) => (a, b) => order * collator.compare(
      a.children[index].innerHTML,
      b.children[index].innerHTML
    );

    for(const tBody of target.closest('table').tBodies)
      tBody.append(...[...tBody.rows].sort(comparator(index, order)));

    for(const cell of target.parentNode.cells)
      cell.classList.toggle('sorted', cell === target);
  };

  document.querySelectorAll('#myTable thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));

});

function searchByName() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function searchByState() {
  let select, filter, table, tr, td, i, txtValue;
  select = document.getElementById("mySelect");
  filter = select.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[5];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

$('#myTable').each(function() {
  var currentPage = 0;
  var numPerPage = 20;
  var $table = $(this);
  $table.bind('repaginate', function() {
    $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
  });
  $table.trigger('repaginate');
  var numRows = $table.find('tbody tr').length;
  var numPages = Math.ceil(numRows / numPerPage);
  var $pager = $('<div class="pager"></div>');
  for (var page = 0; page < numPages; page++) {
    $('<span class="page-number"></span>').text(page + 1).bind('click', {
      newPage: page
    }, function(event) {
      currentPage = event.data['newPage'];
      $table.trigger('repaginate');
      $(this).addClass('active').siblings().removeClass('active');
    }).appendTo($pager).addClass('clickable');
  }
  $pager.insertBefore($table).find('span.page-number:first').addClass('active');
});