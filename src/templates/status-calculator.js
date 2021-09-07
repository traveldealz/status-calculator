export default /*html*/ `
  <style>
  button[disabled] {
    background-color: gray;
  }
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <textarea name="route" class="w-full my-1" rows="8">LH:A:FRA-HKG-MUC</textarea>
    <small></small>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
      <label for="status">__(Status)</label>
      <select id="statusoptions" name="status">
        <optgroup label="Star Alliance">
          <option value="Silver">Star Alliance Silver</option>
          <option value="Gold">Star Alliance Gold</option>
        </optgroup>
        <optgroup label="SkyTeam">
          <option value="Elite">SkyTeam Elite</option>
          <option value="Elite Plus">SkyTeam Elite Plus</option>
        </optgroup>
        <optgroup label="Oneworld">
          <option value="Ruby">Oneworld Ruby</option>
          <option value="Sapphire">Oneworld Sapphire</option>
          <option value="Emerald">Oneworld Emerald</option>
        </optgroup>
      </select>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ol id="list"></ol>
  <p><small>__(Data provided by) <a href="https://www.wheretocredit.com" target="_blank">wheretocredit.com</a></small></p>
`;
