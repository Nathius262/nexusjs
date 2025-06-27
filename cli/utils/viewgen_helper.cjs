// Template generators
function generateAdminCreateView(moduleName, modelName) {
  return `
  <h1>Create ${modelName}</h1>
  <form action="/admin/${moduleName}" method="POST">
    <!-- Add your form fields here -->
    <div class="form-group">
      <button type="submit">Create</button>
    </div>
  </form>
  `;
}

function generateAdminUpdateView(moduleName, modelName) {
  return `
  <h1>Update ${modelName}</h1>
  <form action="/admin/${moduleName}/{{${moduleName}.id}}" method="POST">
    <input type="hidden" name="_method" value="PUT">
    <!-- Add your form fields here -->
    <div class="form-group">
      <button type="submit">Update</button>
    </div>
  </form>
  `;
}

function generateAdminListView(moduleName, modelName) {
  return `
  <h1>${modelName} List</h1>
  <a href="/admin/${moduleName}/create">Create New</a>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <!-- Add your table headers here -->
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {{#each ${moduleName}s}}
        <tr>
          <td>{{this.id}}></td>
          <!-- Add your table cells here -->
          <td>
            <a href="/admin/${moduleName}/{{this.id}}>">Edit</a>
            <form action="/admin/${moduleName}/{{ this.id}}>" method="POST" style="display: inline;">
              <input type="hidden" name="_method" value="DELETE">
              <button type="submit">Delete</button>
            </form>
          </td>
        </tr>
      {{/each}}
    </tbody>
  </table>
  `;
}

function generatePublicListView(moduleName, modelName) {
  return `
  <h1>${modelName} List</h1>
  <ul>
    {{#each ${moduleName}s}}
      <li>
        <a href="/${moduleName}/{{this.id}}">{{this.id}}</a>
      </li>
    {{/each}}
  </ul>
  `;
}

function generatePublicSingleView(moduleName, modelName) {
  return `
  <h1>{{${moduleName}.name}} || '${modelName} Details' %></h1>
  <dl>
    <!-- Add your detail fields here -->
    <dt>ID</dt>
    <dd>{{${moduleName}.id}}</dd>
  </dl>
  <a href="/${moduleName}">Back to list</a>
  `;
}

module.exports = {
  generateAdminCreateView,
  generateAdminListView,
  generateAdminUpdateView,
  generatePublicListView,
  generatePublicSingleView
};