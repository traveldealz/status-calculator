export default /*html*/ `
  <style>
  button[disabled] {
    background-color: gray;
  }
  
  </style>
  <form>
    <label for="route">__(Routes)</label>
    <autocomplete-airports>
      <textarea id="route" name="route" class="w-full my-1" rows="2">HAM-FRA-EZE</textarea>
    </autocomplete-airports>
    <small></small>
    <p><small>__(See instructions on) <a href="__(https://travel-dealz.eu/tools/distance-calculator)" target="_blank">__(mileage calculator)</a> </small> </p>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ul class="col-2" id="list"></ul>
`;
