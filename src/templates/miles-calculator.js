export default /*html*/ `
  <style>
  button[disabled] {
    background-color: gray;
  }
  ul {
    -webkit-column-count: 2;
    -moz-column-count: 2;
    column-count: 2;
}
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <textarea name="route" class="w-full my-1" rows="2">LH:P:HAM-FRA-EZE</textarea>
    <small></small>
    <p><small>__(See instructions on) <a href="__(https://travel-dealz.eu/tools/miles-calculator)" target="_blank">__(mileage calculator)</a> </small> </p>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
      <label for="Berechnungsart">__(Berechnungsart)</label>
      <select name="Oneway">
      <option selected>Hin und Rückflug</option>
          <option>Oneway</option>
      </select>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ul id="list"></ul>
  <p><small>__(Data provided by) <a href="https://www.wheretocredit.com" target="_blank">wheretocredit.com</a> __(and) Travel-Dealz.de</small> </p>
`;
