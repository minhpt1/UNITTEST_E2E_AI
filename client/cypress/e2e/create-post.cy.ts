/**
 * E2E Test: Create Post Flow
 * URL: http://localhost:3001/create-post
 *
 * Flow tested:
 * 1. Page loads correctly with empty form and categories
 * 2. Form validation (required fields: title, summary, content, category)
 * 3. Tags input (add by button, add by Enter key, remove tag)
 * 4. Successfully create a draft post
 * 5. Successfully create a published post
 * 6. Form shows loading state during submission
 * 7. Error handling when API fails
 * 8. Cancel navigates back to /blog
 * 9. Full integration flow end-to-end
 */

const CREATE_POST_URL = '/create-post';
const API_CATEGORIES_URL = '**/api/categories';
const API_CREATE_POST_URL = '**/api/admin/posts';
const BLOG_URL = '/blog';

// Matches actual Category shape from database.json (no updatedAt in BE)
const mockCategories = [
  {
    id: 'ml6e7cym55yu44koz4i',
    name: 'Technology',
    slug: 'technology',
    description: 'Posts about programming, web development, and tech trends',
    createdAt: '2026-02-03T09:24:54.238Z',
  },
  {
    id: 'ml6e7cyn6obx7q791ip',
    name: 'Personal',
    slug: 'personal',
    description: 'Personal thoughts and experiences',
    createdAt: '2026-02-03T09:24:54.239Z',
  },
];

// Matches actual BlogPost shape returned by POST /api/admin/posts
const mockCreatedPost = {
  id: 'mnewpostid123abc',
  title: 'My E2E Test Post',
  content: 'This is the detailed content of the E2E test post.',
  summary: 'A brief summary for the E2E test post.',
  slug: 'my-e2e-test-post',
  authorId: 'ml6e7cyjmhhd7pj5i9',
  category: 'Technology',
  tags: ['e2e', 'testing'],
  status: 'published' as const,
  featuredImage: '',
  createdAt: '2026-02-23T08:00:00.000Z',
  updatedAt: '2026-02-23T08:00:00.000Z',
  publishedAt: '2026-02-23T08:00:00.000Z',
};

describe('Create Post Flow', () => {
  describe('Page Load', () => {
    beforeEach(() => {
      cy.intercept('GET', API_CATEGORIES_URL, {
        statusCode: 200,
        body: mockCategories,
      }).as('getCategories');
      cy.visit(CREATE_POST_URL);
      cy.wait('@getCategories');
    });

    it('should display the create post page', () => {
      cy.contains('h1', 'Create New Post').should('be.visible');
    });

    it('should display all required form fields', () => {
      cy.get('#title').should('be.visible');
      cy.get('#summary').should('be.visible');
      cy.get('#content').should('be.visible');
      cy.get('#category').should('be.visible');
      cy.get('#status').should('be.visible');
    });

    it('should display optional fields', () => {
      cy.get('#featuredImage').should('be.visible');
      cy.get('input[placeholder="Enter tag and press Enter"]').should('be.visible');
    });

    it('should show correct field labels', () => {
      cy.get('label[for="title"]').should('contain', 'Title');
      cy.get('label[for="summary"]').should('contain', 'Summary');
      cy.get('label[for="content"]').should('contain', 'Content');
      cy.get('label[for="category"]').should('contain', 'Category');
      cy.get('label[for="status"]').should('contain', 'Status');
    });

    it('should load categories into select dropdown', () => {
      cy.get('#category').should('contain', 'Technology');
      cy.get('#category').should('contain', 'Personal');
    });

    it('should have default status as draft', () => {
      cy.get('#status').should('have.value', 'draft');
    });

    it('should show action buttons: Cancel and Create Post', () => {
      cy.contains('button', 'Cancel').should('be.visible');
      cy.contains('button', 'Create Post').should('be.visible');
    });

    it('should show empty form fields on load', () => {
      cy.get('#title').should('have.value', '');
      cy.get('#summary').should('have.value', '');
      cy.get('#content').should('have.value', '');
      cy.get('#category').should('have.value', '');
      cy.get('#featuredImage').should('have.value', '');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      cy.intercept('GET', API_CATEGORIES_URL, {
        statusCode: 200,
        body: mockCategories,
      }).as('getCategories');
      cy.visit(CREATE_POST_URL);
      cy.wait('@getCategories');
    });

    it('should show error when submitting with all fields empty', () => {
      cy.intercept('POST', API_CREATE_POST_URL).as('createPost');
      cy.contains('button', 'Create Post').click();
      cy.contains('Please fill in all required fields').should('be.visible');
      cy.get('@createPost.all').should('have.length', 0);
    });

    it('should show error when title is missing', () => {
      cy.intercept('POST', API_CREATE_POST_URL).as('createPost');
      cy.get('#summary').type('A brief summary.');
      cy.get('#content').type('Some detailed content.');
      cy.get('#category').select('Technology');
      cy.contains('button', 'Create Post').click();
      cy.contains('Please fill in all required fields').should('be.visible');
      cy.get('@createPost.all').should('have.length', 0);
    });

    it('should show error when summary is missing', () => {
      cy.intercept('POST', API_CREATE_POST_URL).as('createPost');
      cy.get('#title').type('A Test Title');
      cy.get('#content').type('Some detailed content.');
      cy.get('#category').select('Technology');
      cy.contains('button', 'Create Post').click();
      cy.contains('Please fill in all required fields').should('be.visible');
      cy.get('@createPost.all').should('have.length', 0);
    });

    it('should show error when content is missing', () => {
      cy.intercept('POST', API_CREATE_POST_URL).as('createPost');
      cy.get('#title').type('A Test Title');
      cy.get('#summary').type('A brief summary.');
      cy.get('#category').select('Technology');
      cy.contains('button', 'Create Post').click();
      cy.contains('Please fill in all required fields').should('be.visible');
      cy.get('@createPost.all').should('have.length', 0);
    });

    it('should show error when category is missing', () => {
      cy.intercept('POST', API_CREATE_POST_URL).as('createPost');
      cy.get('#title').type('A Test Title');
      cy.get('#summary').type('A brief summary.');
      cy.get('#content').type('Some detailed content.');
      cy.contains('button', 'Create Post').click();
      cy.contains('Please fill in all required fields').should('be.visible');
      cy.get('@createPost.all').should('have.length', 0);
    });

    it('should clear error message when correcting the form', () => {
      cy.contains('button', 'Create Post').click();
      cy.contains('Please fill in all required fields').should('be.visible');

      cy.get('#title').type('A Test Title');
      cy.get('#summary').type('A brief summary.');
      cy.get('#content').type('Some detailed content.');
      cy.get('#category').select('Technology');

      cy.intercept('POST', API_CREATE_POST_URL, {
        statusCode: 201,
        body: mockCreatedPost,
      }).as('createPost');

      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));
      cy.contains('button', 'Create Post').click();
      cy.get('.error-message').should('not.exist');
    });
  });

  describe('Tags Input', () => {
    beforeEach(() => {
      cy.intercept('GET', API_CATEGORIES_URL, {
        statusCode: 200,
        body: mockCategories,
      }).as('getCategories');
      cy.visit(CREATE_POST_URL);
      cy.wait('@getCategories');
    });

    it('should add a tag by clicking Add button', () => {
      cy.get('input[placeholder="Enter tag and press Enter"]').type('e2e');
      cy.get('.add-tag-btn').click();
      cy.get('.tag-item').should('contain', '#e2e');
      cy.get('input[placeholder="Enter tag and press Enter"]').should('have.value', '');
    });

    it('should add a tag by pressing Enter key', () => {
      cy.get('input[placeholder="Enter tag and press Enter"]').type('cypress{enter}');
      cy.get('.tag-item').should('contain', '#cypress');
      cy.get('input[placeholder="Enter tag and press Enter"]').should('have.value', '');
    });

    it('should add multiple tags', () => {
      cy.get('input[placeholder="Enter tag and press Enter"]').type('e2e{enter}');
      cy.get('input[placeholder="Enter tag and press Enter"]').type('testing{enter}');
      cy.get('input[placeholder="Enter tag and press Enter"]').type('cypress{enter}');
      cy.get('.tag-item').should('have.length', 3);
      cy.get('.tag-item').eq(0).should('contain', '#e2e');
      cy.get('.tag-item').eq(1).should('contain', '#testing');
      cy.get('.tag-item').eq(2).should('contain', '#cypress');
    });

    it('should not add duplicate tags', () => {
      cy.get('input[placeholder="Enter tag and press Enter"]').type('e2e{enter}');
      cy.get('input[placeholder="Enter tag and press Enter"]').type('e2e{enter}');
      cy.get('.tag-item').should('have.length', 1);
    });

    it('should not add empty tag', () => {
      cy.get('.add-tag-btn').click();
      cy.get('.tag-item').should('have.length', 0);
    });

    it('should remove a tag by clicking × button', () => {
      cy.get('input[placeholder="Enter tag and press Enter"]').type('e2e{enter}');
      cy.get('input[placeholder="Enter tag and press Enter"]').type('testing{enter}');
      cy.get('.tag-item').should('have.length', 2);
      cy.get('.tag-item').first().find('.remove-tag').click();
      cy.get('.tag-item').should('have.length', 1);
      cy.get('.tag-item').should('contain', '#testing');
    });
  });

  describe('Successful Post Creation', () => {
    beforeEach(() => {
      cy.intercept('GET', API_CATEGORIES_URL, {
        statusCode: 200,
        body: mockCategories,
      }).as('getCategories');
      cy.visit(CREATE_POST_URL);
      cy.wait('@getCategories');
    });

    it('should submit correct request body when creating a draft post', () => {
      cy.intercept('POST', API_CREATE_POST_URL, {
        statusCode: 201,
        body: { ...mockCreatedPost, status: 'draft', publishedAt: undefined },
      }).as('createPost');
      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

      cy.get('#title').type('My Draft Post');
      cy.get('#summary').type('Draft summary.');
      cy.get('#content').type('Draft content.');
      cy.get('#category').select('Personal');
      // status is already 'draft' by default

      cy.contains('button', 'Create Post').click();
      cy.wait('@createPost').its('request.body').should('deep.include', {
        title: 'My Draft Post',
        summary: 'Draft summary.',
        content: 'Draft content.',
        category: 'Personal',
        status: 'draft',
        tags: [],
      });
    });

    it('should submit correct request body when creating a published post with tags', () => {
      cy.intercept('POST', API_CREATE_POST_URL, {
        statusCode: 201,
        body: mockCreatedPost,
      }).as('createPost');
      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

      cy.get('#title').type('My E2E Test Post');
      cy.get('#summary').type('A brief summary for the E2E test post.');
      cy.get('#content').type('This is the detailed content of the E2E test post.');
      cy.get('#category').select('Technology');
      cy.get('#status').select('published');

      cy.get('input[placeholder="Enter tag and press Enter"]').type('e2e{enter}');
      cy.get('input[placeholder="Enter tag and press Enter"]').type('testing{enter}');

      cy.contains('button', 'Create Post').click();
      cy.wait('@createPost').its('request.body').should('deep.include', {
        title: 'My E2E Test Post',
        summary: 'A brief summary for the E2E test post.',
        content: 'This is the detailed content of the E2E test post.',
        category: 'Technology',
        status: 'published',
        tags: ['e2e', 'testing'],
      });
    });

    it('should show success alert after post is created', () => {
      cy.intercept('POST', API_CREATE_POST_URL, {
        statusCode: 201,
        body: mockCreatedPost,
      }).as('createPost');
      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

      cy.get('#title').type('My E2E Test Post');
      cy.get('#summary').type('A brief summary.');
      cy.get('#content').type('Some content.');
      cy.get('#category').select('Technology');

      cy.contains('button', 'Create Post').click();
      cy.wait('@createPost');

      cy.get('@alertStub').should('have.been.calledWith', 'Post created successfully!');
    });

    it('should navigate to /blog after successful creation', () => {
      cy.intercept('POST', API_CREATE_POST_URL, {
        statusCode: 201,
        body: mockCreatedPost,
      }).as('createPost');
      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

      // Stub blog page requests to avoid extra failures
      cy.intercept('GET', '**/api/posts**', { statusCode: 200, body: { posts: [], totalPosts: 0, currentPage: 1, totalPages: 0, hasNext: false, hasPrev: false } }).as('getPosts');
      cy.intercept('GET', API_CATEGORIES_URL, { statusCode: 200, body: mockCategories }).as('getCategories2');

      cy.get('#title').type('My E2E Test Post');
      cy.get('#summary').type('A brief summary.');
      cy.get('#content').type('Some content.');
      cy.get('#category').select('Technology');

      cy.contains('button', 'Create Post').click();
      cy.wait('@createPost');

      cy.url().should('include', BLOG_URL);
    });

    it('should show loading state (Creating...) while submitting', () => {
      cy.intercept('POST', API_CREATE_POST_URL, (req) => {
        req.reply({ delay: 1500, statusCode: 201, body: mockCreatedPost });
      }).as('createPostDelayed');
      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

      cy.get('#title').type('My E2E Test Post');
      cy.get('#summary').type('A brief summary.');
      cy.get('#content').type('Some content.');
      cy.get('#category').select('Technology');

      cy.contains('button', 'Create Post').click();

      cy.contains('button', 'Creating...').should('be.visible').and('be.disabled');
      cy.wait('@createPostDelayed');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.intercept('GET', API_CATEGORIES_URL, {
        statusCode: 200,
        body: mockCategories,
      }).as('getCategories');
      cy.visit(CREATE_POST_URL);
      cy.wait('@getCategories');
    });

    it('should show error message when API returns 500', () => {
      cy.intercept('POST', API_CREATE_POST_URL, {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('createPostFail');

      cy.get('#title').type('My E2E Test Post');
      cy.get('#summary').type('A brief summary.');
      cy.get('#content').type('Some content.');
      cy.get('#category').select('Technology');

      cy.contains('button', 'Create Post').click();
      cy.wait('@createPostFail');

      cy.contains('An error occurred while creating the post').should('be.visible');
    });

    it('should show error message when API returns 400', () => {
      cy.intercept('POST', API_CREATE_POST_URL, {
        statusCode: 400,
        body: { error: 'Title, content, and summary are required' },
      }).as('createPostBadRequest');

      cy.get('#title').type('My E2E Test Post');
      cy.get('#summary').type('A brief summary.');
      cy.get('#content').type('Some content.');
      cy.get('#category').select('Technology');

      cy.contains('button', 'Create Post').click();
      cy.wait('@createPostBadRequest');

      cy.contains('An error occurred while creating the post').should('be.visible');
    });

    it('should handle empty categories gracefully', () => {
      cy.intercept('GET', API_CATEGORIES_URL, {
        statusCode: 200,
        body: [],
      }).as('getEmptyCategories');

      cy.visit(CREATE_POST_URL);
      cy.wait('@getEmptyCategories');

      cy.get('#category').should('be.visible');
      cy.get('#category option').should('have.length', 1); // only the placeholder "Select category"
      cy.get('#category').should('contain', 'Select category');
    });
  });

  describe('Cancel Navigation', () => {
    beforeEach(() => {
      cy.intercept('GET', API_CATEGORIES_URL, {
        statusCode: 200,
        body: mockCategories,
      }).as('getCategories');
      cy.intercept('GET', '**/api/posts**', {
        statusCode: 200,
        body: { posts: [], totalPosts: 0, currentPage: 1, totalPages: 0, hasNext: false, hasPrev: false },
      }).as('getPosts');
      cy.intercept('GET', API_CATEGORIES_URL, { statusCode: 200, body: mockCategories }).as('getCategories2');
    });

    it('should navigate to /blog when Cancel is clicked', () => {
      cy.visit(CREATE_POST_URL);
      cy.contains('button', 'Cancel').click();
      cy.url().should('include', BLOG_URL);
    });

    it('should navigate to /blog even with partially filled form', () => {
      cy.visit(CREATE_POST_URL);
      cy.get('#title').type('Partial title');
      cy.get('#summary').type('Partial summary');
      cy.contains('button', 'Cancel').click();
      cy.url().should('include', BLOG_URL);
    });
  });

  describe('Full Create Post Flow (Integration)', () => {
    it('should complete the full published post creation flow end-to-end', () => {
      // Step 1: Load page with categories
      cy.intercept('GET', API_CATEGORIES_URL, {
        statusCode: 200,
        body: mockCategories,
      }).as('getCategories');
      cy.visit(CREATE_POST_URL);
      cy.wait('@getCategories');

      // Step 2: Verify page renders correctly
      cy.contains('h1', 'Create New Post').should('be.visible');
      cy.get('#category').should('contain', 'Technology');
      cy.get('#category').should('contain', 'Personal');

      // Step 3: Fill in required fields
      cy.get('#title').type('My E2E Test Post');
      cy.get('#summary').type('A brief summary for the E2E test post.');
      cy.get('#content').type('This is the detailed content of the E2E test post.');
      cy.get('#category').select('Technology');
      cy.get('#status').select('published');
      cy.get('#featuredImage').type('https://example.com/image.jpg');

      // Step 4: Add tags
      cy.get('input[placeholder="Enter tag and press Enter"]').type('e2e{enter}');
      cy.get('input[placeholder="Enter tag and press Enter"]').type('testing');
      cy.get('.add-tag-btn').click();
      cy.get('.tag-item').should('have.length', 2);

      // Step 5: Intercept create post API
      cy.intercept('POST', API_CREATE_POST_URL, {
        statusCode: 201,
        body: mockCreatedPost,
      }).as('createPost');
      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

      // Stub blog page to avoid cascade failures
      cy.intercept('GET', '**/api/posts**', {
        statusCode: 200,
        body: { posts: [], totalPosts: 0, currentPage: 1, totalPages: 0, hasNext: false, hasPrev: false },
      }).as('getPosts');

      // Step 6: Submit form
      cy.contains('button', 'Create Post').click();
      cy.wait('@createPost').its('request.body').should('deep.include', {
        title: 'My E2E Test Post',
        summary: 'A brief summary for the E2E test post.',
        content: 'This is the detailed content of the E2E test post.',
        category: 'Technology',
        status: 'published',
        featuredImage: 'https://example.com/image.jpg',
        tags: ['e2e', 'testing'],
      });

      // Step 7: Verify success alert and navigation
      cy.get('@alertStub').should('have.been.calledWith', 'Post created successfully!');
      cy.url().should('include', BLOG_URL);
    });
  });
});
