export default
/*html*/
`
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
      <select id="statusselector" name="status">
        <optgroup label="Star Alliance">
          <option>Star Alliance Silver</option>
          <option>Star Alliance Gold</option>
        </optgroup>
        <optgroup label="SkyTeam">
          <option>SkyTeam Elite</option>
          <option>SkyTeam Elite Plus</option>
        </optgroup>
        <optgroup label="Oneworld">
          <option>Oneworld Ruby</option>
          <option>Oneworld Sapphire</option>
          <option>Oneworld Emerald</option>
        </optgroup>
      </select>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ol id="list"></ol>
  <p><small>__(Data provided by) <a href="https://www.wheretocredit.com" target="_blank">wheretocredit.com</a></small></p>
`;