export default /*html*/ `
  <style>
  button[disabled] {
    background-color: gray;
  }
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <autocomplete-airports>
      <textarea name="route" class="w-full my-1" rows="8">LH:P:FRA-LHR-PEK
  UA:K:LHR-HKG:UA:265</textarea>
    </autocomplete-airports>
    <small></small>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
      <label for="status">__(Status)</label>
      <select name="status">
      </select>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <table id="list"></table>
  <p><small>__(Data provided by) <a href="https://miles.travel-dealz.com" target="_blank">miles.travel-dealz.com</a></small></p>
`;
