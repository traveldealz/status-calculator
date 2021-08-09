export default
/*html*/
`
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
    <textarea name="route" class="w-full my-1" rows="2">LH:A:FRA-HKG-MUC</textarea>
    <small></small>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ul id="list"></ul>
  <p><small>__(Data provided by) <a href="https://www.wheretocredit.com" target="_blank">wheretocredit.com</a> __(and) Travel-Dealz.de</small> </p>
`;