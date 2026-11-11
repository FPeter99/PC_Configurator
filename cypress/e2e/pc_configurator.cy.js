describe('pc konfigurátor tesztek', () => {
  beforeEach(() => {

    cy.visit('/');
  });

  it('oldal betöltés és fejléc ellenőrzése', () => {
    cy.get('header h1').should('contain.text', 'PC Összeállító');
    cy.get('#cat-nav').should('be.visible');
    cy.get('.nav-btn').should('have.length', 8);

    // alapból a processzorok látszanak
    cy.get('.nav-btn.active').should('contain.text', 'Processzor');
    cy.get('#section-title').should('contain.text', 'Processzor');
    cy.get('#cards .card').should('have.length.greaterThan', 0);
  });

  it('kategóriák közötti navigáció', () => {
    // alaplapra kattintás
    cy.get('.nav-btn[data-part-type="motherboards"]').click();
    cy.get('.nav-btn[data-part-type="motherboards"]').should('have.class', 'active');
    cy.get('#section-title').should('contain.text', 'Alaplap');
    cy.get('#cards .card').should('have.length.greaterThan', 0);

    // videokártyára kattintás
    cy.get('.nav-btn[data-part-type="gpus"]').click();
    cy.get('#section-title').should('contain.text', 'Videokártya');
    cy.get('#cards .card').should('have.length.greaterThan', 0);
  });

  it('keresés név alapján', () => {
    // keresés szövegre
    cy.get('#search-input').type('Ryzen 7');
    cy.get('#cards .card').each(($card) => {
      cy.wrap($card).find('.card-title').should('contain.text', 'Ryzen 7');
    });

    // törlés
    cy.get('#search-input').clear();
    cy.get('#cards .card').should('have.length.greaterThan', 2);
  });


  it('mobil nézet gombok működése', () => {
    cy.viewport('iphone-x');

    // menü nyitás és csukás
    cy.get('#menu-toggle').should('be.visible').click();
    cy.get('#cat-nav').should('have.class', 'open');
    cy.get('#menu-toggle').click();
    cy.get('#cat-nav').should('not.have.class', 'open');

    // összegző sáv nyitás és csukás
    cy.get('#summary-toggle').should('be.visible').click();
    cy.get('#summary').should('have.class', 'open');
    cy.get('#summary-toggle').click();
    cy.get('#summary').should('not.have.class', 'open');
  });
});
