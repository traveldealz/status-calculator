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
    <textarea name="route" class="w-full my-1" rows="8">BA:K:FRA-LHR
BA:W:LHR-HKG</textarea>
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
  <p><small>__(Points Data provided by Travel-Dealz.eu)</small></p>
`;