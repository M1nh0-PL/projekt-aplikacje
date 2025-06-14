$(document).ready(function(){
    // Stylizacja tła i pól
    $('#tresc').css('background-color', 'lightgray');
    $('input[type="number"], input[disabled]').css('font-weight', 'bold');
    $('#wynik, #wynik2').addClass('zielony');
  
    // Obsługa kliknięcia przycisku
    $('#oblicz').click(function(){
      var kwota = parseFloat($("#kwota").val());
      var oprocentowanie = parseFloat($("#oprocentowanie").val());
      var liczbaRat = parseInt($("#liczbaRat").val());
  
      if (isNaN(kwota) || isNaN(oprocentowanie) || isNaN(liczbaRat) || liczbaRat <= 0) {
        $("#wynik").val("Błąd danych");
        $("#wynik2").val("");
        return;
      }
  
      var miesiecznaStopa = oprocentowanie / 12 / 100;
      var rata = (kwota * miesiecznaStopa) / (1 - Math.pow(1 + miesiecznaStopa, -liczbaRat));
      var suma = rata * liczbaRat;
  
      $("#wynik").val(rata.toFixed(2) + " zł");
      $("#wynik2").val(suma.toFixed(2) + " zł");
    });
  });