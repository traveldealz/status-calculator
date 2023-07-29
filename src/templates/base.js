export default /*html*/ `
  <form>
    <label for="route">__(Routings)</label>
    <autocomplete-airports>
      <textarea id="route" name="route" class="w-full my-1" rows="8">LH:A:FRA-HKG-MUC</textarea>
    </autocomplete-airports>
    <small></small>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ol id="list"></ol>
  <p><small>__(Data provided by) <a href="https://www.travel-dealz.com" target="_blank">travel-dealz.com</a></small></p>
`;
