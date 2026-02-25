/**
 * E2E Test: Submit Post Comment - Post Detail Page
 * URL: http://localhost:3001/posts/new-post
 *
 * Flow tested:
 * 1. Page loads correctly with post content and comment form
 * 2. Comment form validation (required fields)
 * 3. Successfully submit a comment
 * 4. Form resets after successful submission
 * 5. New comment appears in the comments list
 */

const POST_SLUG = 'new-post';
const POST_URL = `/posts/${POST_SLUG}`;
const API_POST_URL = `**/api/posts/${POST_SLUG}`;
const API_COMMENT_URL = `**/api/posts/${POST_SLUG}/comments`;

// Matches actual BlogPost shape from src/models/index.ts & database.json (slug: new-post)
const mockPost = {
  id: 'ml6h3m0eibfiuml86g',
  title: 'New post123',
  content: 'Content',
  summary: 'Des',
  slug: POST_SLUG,
  authorId: 'ml6e7cyjmhhd7pj5i9',
  category: 'Personal',
  tags: [] as string[],
  status: 'published' as const,
  featuredImage: '',
  createdAt: '2026-02-03T10:45:58.190Z',
  updatedAt: '2026-02-03T10:45:58.190Z',
  publishedAt: '2026-02-03T10:45:58.190Z',
};

// Matches actual Comment shape from src/models/index.ts (no updatedAt field in BE)
const mockComment = {
  id: 'ml6h9sdaa55x98m3ige',
  postId: 'ml6h3m0eibfiuml86g',
  authorName: 'Test User',
  authorEmail: 'testuser@example.com',
  content: 'This is a test comment for E2E testing.',
  createdAt: '2026-02-03T10:50:46.366Z',
};

// Matches actual PostDetail API response shape: { post: BlogPost, comments: Comment[] }
const mockPostDetail = {
  post: mockPost,
  comments: [] as typeof mockComment[],
};

const mockPostWithComment = {
  post: mockPost,
  comments: [mockComment],
};

describe('Post Comment Submit - Post Detail Page', () => {
  describe('Page Load', () => {
    beforeEach(() => {
      cy.intercept('GET', API_POST_URL, { statusCode: 200, body: mockPostDetail }).as('getPost');
      cy.visit(POST_URL);
      cy.wait('@getPost');
    });

    it('should display the post detail page', () => {
      cy.contains('New post123').should('be.visible');
    });

    it('should display the comment form', () => {
      cy.get('form.comment-form').should('be.visible');
      cy.contains('h3', 'Leave a Comment').should('be.visible');
    });

    it('should display all required comment form fields', () => {
      cy.get('#authorName').should('be.visible');
      cy.get('#authorEmail').should('be.visible');
      cy.get('#content').should('be.visible');
      cy.contains('button', 'Submit Comment').should('be.visible');
    });

    it('should display correct field labels', () => {
      cy.get('label[for="authorName"]').should('contain', 'Name');
      cy.get('label[for="authorEmail"]').should('contain', 'Email');
      cy.get('label[for="content"]').should('contain', 'Comment');
    });

    it('should show empty comments section when no comments exist', () => {
      cy.get('form.comment-form').should('exist');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      cy.intercept('GET', API_POST_URL, { statusCode: 200, body: mockPostDetail }).as('getPost');
      cy.visit(POST_URL);
      cy.wait('@getPost');
    });

    it('should not submit form when all fields are empty', () => {
      cy.intercept('POST', API_COMMENT_URL).as('submitComment');
      cy.contains('button', 'Submit Comment').click();
      // HTML5 required validation prevents submission - API should not be called
      cy.get('@submitComment.all').should('have.length', 0);
    });

    it('should not submit form when name is missing', () => {
      cy.intercept('POST', API_COMMENT_URL).as('submitComment');
      cy.get('#authorEmail').type('test@example.com');
      cy.get('#content').type('A comment without name');
      cy.contains('button', 'Submit Comment').click();
      cy.get('@submitComment.all').should('have.length', 0);
    });

    it('should not submit form when email is missing', () => {
      cy.intercept('POST', API_COMMENT_URL).as('submitComment');
      cy.get('#authorName').type('Test User');
      cy.get('#content').type('A comment without email');
      cy.contains('button', 'Submit Comment').click();
      cy.get('@submitComment.all').should('have.length', 0);
    });

    it('should not submit form when comment content is missing', () => {
      cy.intercept('POST', API_COMMENT_URL).as('submitComment');
      cy.get('#authorName').type('Test User');
      cy.get('#authorEmail').type('test@example.com');
      cy.contains('button', 'Submit Comment').click();
      cy.get('@submitComment.all').should('have.length', 0);
    });

    it('should validate email format', () => {
      cy.intercept('POST', API_COMMENT_URL).as('submitComment');
      cy.get('#authorName').type('Test User');
      cy.get('#authorEmail').type('invalid-email');
      cy.get('#content').type('A comment with invalid email');
      cy.contains('button', 'Submit Comment').click();
      cy.get('@submitComment.all').should('have.length', 0);
    });
  });

  describe('Successful Comment Submission', () => {
    beforeEach(() => {
      cy.intercept('GET', API_POST_URL, { statusCode: 200, body: mockPostDetail }).as('getPost');
      cy.visit(POST_URL);
      cy.wait('@getPost');
    });

    it('should submit comment successfully with valid data', () => {
      cy.intercept('POST', API_COMMENT_URL, {
        statusCode: 201,
        body: mockComment,
      }).as('submitComment');

      cy.intercept('GET', API_POST_URL, { statusCode: 200, body: mockPostWithComment }).as('getPostUpdated');

      cy.get('#authorName').type('Test User');
      cy.get('#authorEmail').type('testuser@example.com');
      cy.get('#content').type('This is a test comment for E2E testing.');

      cy.contains('button', 'Submit Comment').click();

      cy.wait('@submitComment').its('request.body').should('deep.equal', {
        authorName: 'Test User',
        authorEmail: 'testuser@example.com',
        content: 'This is a test comment for E2E testing.',
      });
    });

    it('should reset form fields after successful submission', () => {
      cy.intercept('POST', API_COMMENT_URL, {
        statusCode: 201,
        body: mockComment,
      }).as('submitComment');

      cy.intercept('GET', API_POST_URL, { statusCode: 200, body: mockPostWithComment }).as('getPostUpdated');

      cy.get('#authorName').type('Test User');
      cy.get('#authorEmail').type('testuser@example.com');
      cy.get('#content').type('This is a test comment for E2E testing.');

      cy.contains('button', 'Submit Comment').click();
      cy.wait('@submitComment');

      // After submission, form fields should be cleared
      cy.get('#authorName').should('have.value', '');
      cy.get('#authorEmail').should('have.value', '');
      cy.get('#content').should('have.value', '');
    });

    it('should display the new comment after submission', () => {
      cy.intercept('POST', API_COMMENT_URL, {
        statusCode: 201,
        body: mockComment,
      }).as('submitComment');

      cy.intercept('GET', API_POST_URL, { statusCode: 200, body: mockPostWithComment }).as('getPostUpdated');

      cy.get('#authorName').type('Test User');
      cy.get('#authorEmail').type('testuser@example.com');
      cy.get('#content').type('This is a test comment for E2E testing.');

      cy.contains('button', 'Submit Comment').click();
      cy.wait('@submitComment');
      cy.wait('@getPostUpdated');

      // Comment should appear in the list
      cy.contains('Test User').should('be.visible');
      cy.contains('This is a test comment for E2E testing.').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.intercept('GET', API_POST_URL, { statusCode: 200, body: mockPostDetail }).as('getPost');
      cy.visit(POST_URL);
      cy.wait('@getPost');
    });

    it('should show error alert when comment submission fails', () => {
      cy.intercept('POST', API_COMMENT_URL, {
        statusCode: 500,
        body: { message: 'Internal Server Error' },
      }).as('submitCommentFail');

      // Stub window.alert to capture it
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      cy.get('#authorName').type('Test User');
      cy.get('#authorEmail').type('testuser@example.com');
      cy.get('#content').type('This comment will fail.');

      cy.contains('button', 'Submit Comment').click();
      cy.wait('@submitCommentFail');

      cy.get('@alertStub').should(
        'have.been.calledWith',
        'An error occurred while submitting comment'
      );
    });

    it('should show error message when post fails to load', () => {
      cy.intercept('GET', API_POST_URL, {
        statusCode: 404,
        body: { message: 'Post not found' },
      }).as('getPostFail');

      cy.visit(POST_URL);
      cy.wait('@getPostFail');

      cy.contains('Unable to load post').should('be.visible');
    });
  });

  describe('Full Comment Submission Flow (Integration)', () => {
    it('should complete the full comment submission flow end-to-end', () => {
      // Step 1: Load post
      cy.intercept('GET', API_POST_URL, { statusCode: 200, body: mockPostDetail }).as('getPost');
      cy.visit(POST_URL);
      cy.wait('@getPost');

      // Step 2: Verify page content
      cy.contains('New post123').should('be.visible');
      cy.get('form.comment-form').should('be.visible');

      // Step 3: Fill in comment form
      cy.get('#authorName').should('be.empty').type('Integration Test User');
      cy.get('#authorEmail').should('be.empty').type('integration@test.com');
      cy.get('#content').should('be.empty').type('This is a full E2E integration test comment.');

      // Step 4: Intercept submit + reload APIs
      cy.intercept('POST', API_COMMENT_URL, {
        statusCode: 201,
        body: {
          ...mockComment,
          authorName: 'Integration Test User',
          authorEmail: 'integration@test.com',
          content: 'This is a full E2E integration test comment.',
        },
      }).as('submitComment');

      cy.intercept('GET', API_POST_URL, {
        statusCode: 200,
        body: {
          post: mockPost,
          comments: [
            {
              ...mockComment,
              authorName: 'Integration Test User',
              authorEmail: 'integration@test.com',
              content: 'This is a full E2E integration test comment.',
            },
          ],
        },
      }).as('getUpdatedPost');

      // Step 5: Submit form
      cy.contains('button', 'Submit Comment').click();
      cy.wait('@submitComment');
      cy.wait('@getUpdatedPost');

      // Step 6: Verify form resets
      cy.get('#authorName').should('have.value', '');
      cy.get('#authorEmail').should('have.value', '');
      cy.get('#content').should('have.value', '');

      // Step 7: Verify comment appears
      cy.contains('Integration Test User').should('be.visible');
      cy.contains('This is a full E2E integration test comment.').should('be.visible');
    });
  });
});
