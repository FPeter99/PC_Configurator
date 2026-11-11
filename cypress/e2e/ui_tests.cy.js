const API = 'http://localhost:8888/api';

function konfigokTorlese() {
  cy.request(`${API}/configurations`).then((valasz) => {
    valasz.body.forEach((konfig) => {
      cy.request('DELETE', `${API}/configurations/${konfig.id}`);
    });
  });
}

describe('UI tesztek', () => {
  describe('UI1: reszponzív töréspontok (960px és 640px)', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('asztali nézetben az összegző panel oldalt van, a ☰ gomb rejtett', () => {
      cy.viewport(1200, 800);
      cy.get('#summary').should('not.have.css', 'position', 'fixed');
      cy.get('#menu-toggle').should('not.be.visible');
      cy.get('#cat-nav').should('be.visible');
    });

    it('960px alatt az összegző panel az oldal aljára kerül és lenyitható', () => {
      cy.viewport(900, 800);
      cy.get('#summary').should('have.css', 'position', 'fixed');
      cy.get('#summary-toggle').should('be.visible').click();
      cy.get('#summary').should('have.class', 'open');
      cy.get('#summary-toggle').click();
      cy.get('#summary').should('not.have.class', 'open');
      cy.get('#cat-nav').should('be.visible');
    });

    it('640px alatt a kategóriamenü ☰ gombbal nyitható menüvé alakul', () => {
      cy.viewport(600, 800);
      cy.get('#menu-toggle').should('be.visible');
      cy.get('#cat-nav').should('not.be.visible');
      cy.get('#menu-toggle').click();
      cy.get('#cat-nav').should('be.visible').and('have.class', 'open');
    });
  });

  describe('UI2: mobil menü', () => {
    it('a menü lenyílik, a gomb ✕ lesz, kategóriaválasztás után bezárul', () => {
      cy.viewport('iphone-x');
      cy.visit('/');

      cy.get('#menu-toggle').should('contain.text', '☰').click();
      cy.get('#cat-nav').should('have.class', 'open');
      cy.get('#menu-toggle').should('contain.text', '✕');

      cy.get('.nav-btn[data-part-type="gpus"]').click();

      cy.get('#cat-nav').should('not.have.class', 'open');
      cy.get('#menu-toggle').should('contain.text', '☰');
      cy.get('#section-title').should('contain.text', 'Videokártya');
    });
  });

  describe('UI3: alkatrészkártyák', () => {
    it('minden kategóriánál 10 kártya jelenik meg a saját mezőivel és árral', () => {
      cy.visit('/');

      // Processzor
      cy.get('.nav-btn[data-part-type="processors"]').click();
      cy.get('#section-title').should('contain.text', 'Processzor');
      cy.get('#section-count').should('contain.text', '(10 alkatrész)');
      cy.get('#cards .card').should('have.length', 10);
      cy.get('#cards .card').first().within(() => {
        cy.get('.card-title').should('not.be.empty');
        cy.contains('.row', 'Foglalat');
        cy.get('.price').should('contain.text', '$');
      });

      // Alaplap
      cy.get('.nav-btn[data-part-type="motherboards"]').click();
      cy.get('#section-title').should('contain.text', 'Alaplap');
      cy.get('#section-count').should('contain.text', '(10 alkatrész)');
      cy.get('#cards .card').should('have.length', 10);
      cy.get('#cards .card').first().within(() => {
        cy.get('.card-title').should('not.be.empty');
        cy.contains('.row', 'CPU foglalat');
        cy.get('.price').should('contain.text', '$');
      });

      // Memória
      cy.get('.nav-btn[data-part-type="ram"]').click();
      cy.get('#section-title').should('contain.text', 'Memória');
      cy.get('#section-count').should('contain.text', '(10 alkatrész)');
      cy.get('#cards .card').should('have.length', 10);
      cy.get('#cards .card').first().within(() => {
        cy.get('.card-title').should('not.be.empty');
        cy.contains('.row', 'Kapacitás');
        cy.get('.price').should('contain.text', '$');
      });

      // Videokártya
      cy.get('.nav-btn[data-part-type="gpus"]').click();
      cy.get('#section-title').should('contain.text', 'Videokártya');
      cy.get('#section-count').should('contain.text', '(10 alkatrész)');
      cy.get('#cards .card').should('have.length', 10);
      cy.get('#cards .card').first().within(() => {
        cy.get('.card-title').should('not.be.empty');
        cy.contains('.row', 'VRAM');
        cy.get('.price').should('contain.text', '$');
      });

      // Tárhely
      cy.get('.nav-btn[data-part-type="storage"]').click();
      cy.get('#section-title').should('contain.text', 'Tárhely');
      cy.get('#section-count').should('contain.text', '(10 alkatrész)');
      cy.get('#cards .card').should('have.length', 10);
      cy.get('#cards .card').first().within(() => {
        cy.get('.card-title').should('not.be.empty');
        cy.contains('.row', 'Interfész');
        cy.get('.price').should('contain.text', '$');
      });

      // Tápegység
      cy.get('.nav-btn[data-part-type="powerSupplies"]').click();
      cy.get('#section-title').should('contain.text', 'Tápegység');
      cy.get('#section-count').should('contain.text', '(10 alkatrész)');
      cy.get('#cards .card').should('have.length', 10);
      cy.get('#cards .card').first().within(() => {
        cy.get('.card-title').should('not.be.empty');
        cy.contains('.row', 'Teljesítmény');
        cy.get('.price').should('contain.text', '$');
      });

      // Ház
      cy.get('.nav-btn[data-part-type="cases"]').click();
      cy.get('#section-title').should('contain.text', 'Ház');
      cy.get('#section-count').should('contain.text', '(10 alkatrész)');
      cy.get('#cards .card').should('have.length', 10);
      cy.get('#cards .card').first().within(() => {
        cy.get('.card-title').should('not.be.empty');
        cy.contains('.row', 'Támogatott formátum');
        cy.get('.price').should('contain.text', '$');
      });

      // CPU hűtő
      cy.get('.nav-btn[data-part-type="cpuCoolers"]').click();
      cy.get('#section-title').should('contain.text', 'CPU hűtő');
      cy.get('#section-count').should('contain.text', '(10 alkatrész)');
      cy.get('#cards .card').should('have.length', 10);
      cy.get('#cards .card').first().within(() => {
        cy.get('.card-title').should('not.be.empty');
        cy.contains('.row', 'Támogatott foglalat');
        cy.get('.price').should('contain.text', '$');
      });
    });
  });

  describe('UI4: aktív kategória', () => {
    it('mindig csak az aktuális kategória gombja aktív', () => {
      cy.visit('/');

      cy.get('.nav-btn.active').should('have.length', 1).and('contain.text', 'Processzor');

      // Processzor
      cy.get('.nav-btn[data-part-type="processors"]').click();
      cy.get('.nav-btn.active').should('have.length', 1);
      cy.get('.nav-btn[data-part-type="processors"]').should('have.class', 'active');

      // Alaplap
      cy.get('.nav-btn[data-part-type="motherboards"]').click();
      cy.get('.nav-btn.active').should('have.length', 1);
      cy.get('.nav-btn[data-part-type="motherboards"]').should('have.class', 'active');

      // Memória
      cy.get('.nav-btn[data-part-type="ram"]').click();
      cy.get('.nav-btn.active').should('have.length', 1);
      cy.get('.nav-btn[data-part-type="ram"]').should('have.class', 'active');

      // Videokártya
      cy.get('.nav-btn[data-part-type="gpus"]').click();
      cy.get('.nav-btn.active').should('have.length', 1);
      cy.get('.nav-btn[data-part-type="gpus"]').should('have.class', 'active');

      // Tárhely
      cy.get('.nav-btn[data-part-type="storage"]').click();
      cy.get('.nav-btn.active').should('have.length', 1);
      cy.get('.nav-btn[data-part-type="storage"]').should('have.class', 'active');

      // Tápegység
      cy.get('.nav-btn[data-part-type="powerSupplies"]').click();
      cy.get('.nav-btn.active').should('have.length', 1);
      cy.get('.nav-btn[data-part-type="powerSupplies"]').should('have.class', 'active');

      // Ház
      cy.get('.nav-btn[data-part-type="cases"]').click();
      cy.get('.nav-btn.active').should('have.length', 1);
      cy.get('.nav-btn[data-part-type="cases"]').should('have.class', 'active');

      // CPU hűtő
      cy.get('.nav-btn[data-part-type="cpuCoolers"]').click();
      cy.get('.nav-btn.active').should('have.length', 1);
      cy.get('.nav-btn[data-part-type="cpuCoolers"]').should('have.class', 'active');
    });
  });

  describe('UI5: mentett konfigurációk oldal', () => {
    beforeEach(() => {
      konfigokTorlese();
    });

    it('üres állapotban a megfelelő szöveg látszik (asztali és mobil nézetben is)', () => {
      cy.visit('/savedConfigs.html');
      cy.get('.empty-configs').should('contain.text', 'Nincsenek mentett konfigurációk.');

      cy.viewport('iphone-x');
      cy.get('.empty-configs').should('be.visible');
    });

    it('feltöltött állapotban minden konfiguráció külön kártyán jelenik meg', () => {
      cy.request('POST', `${API}/configurations`, {
        name: 'Teszt gép 1',
        parts: { processors: { id: 1, name: 'AMD Ryzen 5 7600', price: 181 } },
      });
      cy.request('POST', `${API}/configurations`, {
        name: 'Teszt gép 2',
        parts: {},
      });

      cy.visit('/savedConfigs.html');

      cy.get('.saved-config-item').should('have.length', 2);
      cy.get('.saved-config-item').first().within(() => {
        cy.get('.config-name').should('contain.text', 'Teszt gép 1');
        cy.get('.config-total').should('contain.text', '181');
        cy.get('.load-config-btn').should('be.visible');
        cy.get('.delete-config-btn').should('be.visible');
      });
      cy.get('.empty-configs').should('not.exist');
    });

    it('mobil nézetben a gombok használhatók', () => {
      cy.request('POST', `${API}/configurations`, { name: 'Mobil teszt', parts: {} });

      cy.viewport('iphone-x');
      cy.visit('/savedConfigs.html');

      cy.get('.saved-config-item').should('have.length', 1);
      cy.get('.load-config-btn').should('be.visible');
      cy.get('.delete-config-btn').should('be.visible').click();
      cy.get('#delete-modal').should('be.visible');
      cy.get('#cancel-delete-btn').should('be.visible').click();
      cy.get('#delete-modal').should('not.be.visible');
    });
  });
});