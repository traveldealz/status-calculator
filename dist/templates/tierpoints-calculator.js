export default
/*html*/
`
  <style>
  button[disabled] {
    background-color: gray;
  }
  .align-top {
    vertical-align: top;
  }
  .text-vertical {
    writing-mode: vertical-rl;
    text-orientation: sideways
  }
  .font-light {
    font-weight: 300;
  }
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <autocomplete-airports>
      <textarea id="route" name="route" class="w-full my-1" rows="3">AF:L:FRA-AMS-FRA
AF:X:ATL-CDG-ATL</textarea>
    </autocomplete-airports>
    <small></small>
    <div class="my-3">
      <label for="program">__(Program)</label>
      <select id="program" name="program">
      </select>
      <label for="status">__(Current status)</label>
      <select id="status" name="status">
      </select>
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <table id="list" name="list"></table>
  <p><small>__(Data provided by Travel-Dealz.eu)</small></p>
`;