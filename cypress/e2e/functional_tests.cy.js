const API = 'http://localhost:8888/api';

function konfigokTorlese() {
  cy.request(`${API}/configurations`).then((valasz) => {
    valasz.body.forEach((konfig) => {
      cy.request('DELETE', `${API}/configurations/${konfig.id}`);
    });
  });
}

function kategoria(kulcs) {
  cy.get(`.nav-btn[data-part-type="${kulcs}"]`).then(($gomb) => {
    if (!$gomb.hasClass('active')) {
      cy.wrap($gomb).click();
    }
  });
}

function kartya(nev) {
  const pontosNev = new RegExp(`^${Cypress._.escapeRegExp(nev)}$`);
  return cy.contains('#cards .card-title', pontosNev).closest('.card');
}

function kivalaszt(kulcs, nev) {
  kategoria(kulcs);
  kartya(nev).click();
  kartya(nev).should('have.class', 'selected');
}

function vegosszeg(osszeg) {
  cy.get('#total-amount').should('have.text', `${osszeg} $`);
  cy.get('#bar-total').should('have.text', `${osszeg} $`);
}

function kartyaArak() {
  return cy.get('#cards .price').then(($arak) => {
    return Cypress._.map($arak, (ar) => parseInt(ar.textContent, 10));
  });
}

function jelzesVan(uzenet, kulcsok) {
  kulcsok.forEach((kulcs) => {
    cy.get(`#summary-list .summary-item[data-part-type="${kulcs}"]`)
      .should('have.class', 'conflict')
      .and('contain.text', uzenet);
    cy.get(`.nav-btn[data-part-type="${kulcs}"] .dot`).should('have.class', 'conflict');
  });
  cy.get('.summary-item.conflict').should('have.length', kulcsok.length);
}

function nincsJelzes() {
  cy.get('.summary-item.conflict').should('not.exist');
  cy.get('.conflict-text').should('not.exist');
  cy.get('.nav-btn .dot.conflict').should('not.exist');
}

function mentes(nev) {
  cy.get('#config-name').clear();
  if (nev) {
    cy.get('#config-name').type(nev);
  }
  cy.get('#save-config-btn').click();
  cy.get('#save-config-btn').should('have.text', 'Mentve! ✓');
  cy.get('#save-config-btn', { timeout: 4000 }).should('have.text', 'Konfiguráció mentése');
}

describe('Funkcionális tesztek', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  describe('F1: alkatrész kiválasztása és visszavonása', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#cards .card').should('have.length', 10);
    });

    it('kattintásra kijelölődik, még egy kattintásra a kijelölés megszűnik', () => {
      kartya('AMD Ryzen 5 7600').click();
      kartya('AMD Ryzen 5 7600').should('have.class', 'selected');

      kartya('AMD Ryzen 5 7600').click();
      kartya('AMD Ryzen 5 7600').should('not.have.class', 'selected');
    });

    it('kategóriánként egyszerre csak egy alkatrész lehet kijelölve', () => {
      kartya('AMD Ryzen 5 7600').click();
      kartya('AMD Ryzen 7 7700').click();

      kartya('AMD Ryzen 7 7700').should('have.class', 'selected');
      kartya('AMD Ryzen 5 7600').should('not.have.class', 'selected');
      cy.get('#cards .card.selected').should('have.length', 1);
    });
  });

  describe('F2: keresés', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#cards .card').should('have.length', 10);
    });

    it('kis- és nagybetűvel is a névben egyező alkatrészeket mutatja, a számláló frissül', () => {
      ['ryzen 9', 'RYZEN 9', 'Ryzen 9'].forEach((keresett) => {
        cy.get('#search-input').clear().type(keresett);
        cy.get('#cards .card').should('have.length', 2);
        cy.get('#cards .card-title').each(($cim) => {
          expect($cim.text()).to.contain('Ryzen 9');
        });
        cy.get('#section-count').should('have.text', '(2 alkatrész)');
      });
    });

    it('találat hiányában üres lista jelenik meg hiba nélkül', () => {
      cy.get('#search-input').type('nincs-ilyen-alkatresz');
      cy.get('#cards .card').should('not.exist');
      cy.get('#section-count').should('have.text', '(0 alkatrész)');

      cy.get('#search-input').clear();
      cy.get('#cards .card').should('have.length', 10);
    });
  });

  describe('F3: rendezés ár szerint', () => {
    const NOVEKVO = [176, 181, 197, 243, 259, 338, 392, 392, 473, 500];

    beforeEach(() => {
      cy.visit('/');
      cy.get('#cards .card').should('have.length', 10);
    });

    it('növekvő, majd csökkenő sorrendbe rendezi a kártyákat', () => {
      cy.get('#sort-select').select('Ár: alacsony → magas');
      kartyaArak().should('deep.equal', NOVEKVO);

      cy.get('#sort-select').select('Ár: magas → alacsony');
      kartyaArak().should('deep.equal', [...NOVEKVO].reverse());
    });

    it('keresés mellett is helyesen rendez', () => {
      cy.get('#search-input').type('ryzen');
      cy.get('#cards .card').should('have.length', 6);

      cy.get('#sort-select').select('Ár: alacsony → magas');
      kartyaArak().should('deep.equal', [181, 197, 243, 338, 392, 473]);

      cy.get('#sort-select').select('Ár: magas → alacsony');
      kartyaArak().should('deep.equal', [473, 392, 338, 243, 197, 181]);
    });
  });

  describe('F4: konfigurációár helyes kiszámítása', () => {
    const ALKATRESZEK = [
      { kulcs: 'processors', nev: 'AMD Ryzen 5 7600', ar: 181 },
      { kulcs: 'motherboards', nev: 'Gigabyte B650 EAGLE AX', ar: 124 },
      { kulcs: 'ram', nev: 'Kingston FURY Beast 16GB DDR5-5200', ar: 54 },
      { kulcs: 'gpus', nev: 'NVIDIA GeForce RTX 4060 8GB', ar: 338 },
      { kulcs: 'storage', nev: 'Samsung 990 EVO 1TB', ar: 103 },
      { kulcs: 'powerSupplies', nev: 'Corsair RM650e', ar: 108 },
      { kulcs: 'cases', nev: 'NZXT H5 Flow', ar: 95 },
      { kulcs: 'cpuCoolers', nev: 'DeepCool AK400', ar: 41 },
    ];

    it('a végösszeg egyezik a kézzel összeadott árakkal', () => {
      cy.visit('/');
      cy.get('#cards .card').should('have.length', 10);

      let osszeg = 0;
      ALKATRESZEK.forEach((alkatresz) => {
        kivalaszt(alkatresz.kulcs, alkatresz.nev);
        osszeg += alkatresz.ar;
        vegosszeg(osszeg);
      });

      vegosszeg(1044);
    });
  });

  describe('F5: összegző panel megjelenése', () => {
    it('betöltés után látszik a panel a fő elemeivel', () => {
      cy.visit('/');

      cy.get('#summary').should('be.visible');
      cy.get('#summary-list .summary-item').should('have.length', 8);
      cy.get('#summary-list .summary-status').should('have.length', 8);
      cy.get('#summary-list .summary-status').each(($sor) => {
        expect($sor.text()).to.eq('nincs kiválasztva');
      });

      vegosszeg(0);
      cy.get('#config-name').should('be.visible');
      cy.get('#save-config-btn').should('be.visible').and('contain.text', 'Konfiguráció mentése');
    });
  });

  describe('F6: összegző frissülése alkatrészváltás után', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#cards .card').should('have.length', 10);
    });

    it('választás, csere és visszavonás után a jelenlegi alkatrészek látszanak', () => {
      kivalaszt('processors', 'AMD Ryzen 5 7600');
      cy.get('#summary-list .summary-item[data-part-type="processors"]').within(() => {
        cy.get('.part-name').should('have.text', 'AMD Ryzen 5 7600');
        cy.get('.part-price').should('have.text', '181 $');
      });

      kivalaszt('processors', 'AMD Ryzen 7 7700');
      cy.get('#summary-list .summary-item[data-part-type="processors"]').within(() => {
        cy.get('.part-name').should('have.text', 'AMD Ryzen 7 7700');
        cy.get('.part-price').should('have.text', '243 $');
      });

      kartya('AMD Ryzen 7 7700').click();
      cy.get('#summary-list .summary-item[data-part-type="processors"]')
        .should('contain.text', 'nincs kiválasztva');
    });

    it('a kijelölések kategóriaváltás után is megmaradnak', () => {
      kivalaszt('processors', 'AMD Ryzen 7 7700');
      kivalaszt('gpus', 'NVIDIA GeForce RTX 4060 8GB');

      kategoria('ram');
      cy.get('#summary-list .part-name').should('have.length', 2);

      kategoria('processors');
      kartya('AMD Ryzen 7 7700').should('have.class', 'selected');
      kategoria('gpus');
      kartya('NVIDIA GeForce RTX 4060 8GB').should('have.class', 'selected');
    });
  });

  describe('F7: végösszeg helyes megjelenítése', () => {
    it('választás, csere és visszavonás után is helyes a végösszeg', () => {
      cy.visit('/');
      cy.get('#cards .card').should('have.length', 10);
      vegosszeg(0);

      kivalaszt('processors', 'AMD Ryzen 5 7600');
      vegosszeg(181);

      kivalaszt('gpus', 'NVIDIA GeForce RTX 4060 8GB');
      vegosszeg(519);

      kivalaszt('ram', 'Kingston FURY Beast 16GB DDR5-5200');
      vegosszeg(573);

      kivalaszt('gpus', 'NVIDIA GeForce RTX 4070 12GB');
      vegosszeg(830);

      kategoria('processors');
      kartya('AMD Ryzen 5 7600').click();
      vegosszeg(649);
    });
  });

  describe('F8: kompatibilitás – foglalat', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#cards .card').should('have.length', 10);
    });

    it('AM5 processzor LGA1700 alaplappal jelzést ad, az alaplap cseréje után eltűnik', () => {
      kivalaszt('processors', 'AMD Ryzen 5 7600');
      nincsJelzes();

      kivalaszt('motherboards', 'Gigabyte B760 GAMING X AX');
      jelzesVan('Processzor <=> Alaplap', ['processors', 'motherboards']);
      kartya('Gigabyte B760 GAMING X AX').should('have.class', 'conflict');

      kivalaszt('motherboards', 'MSI PRO B650-S WIFI');
      nincsJelzes();
      kartya('MSI PRO B650-S WIFI').should('not.have.class', 'conflict');
    });

    it('a processzor cseréje után is eltűnik a jelzés', () => {
      kivalaszt('motherboards', 'Gigabyte B760 GAMING X AX');
      kivalaszt('processors', 'AMD Ryzen 5 7600');
      jelzesVan('Processzor <=> Alaplap', ['processors', 'motherboards']);

      kivalaszt('processors', 'Intel Core i5-13400F');
      nincsJelzes();
    });
  });

  describe('F9: kompatibilitás – memória', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#cards .card').should('have.length', 10);
    });

    it('DDR5-ös alaplap DDR4-es memóriával jelzést ad, DDR5-ösnél nincs', () => {
      kivalaszt('motherboards', 'MSI PRO B650-S WIFI');
      kivalaszt('ram', 'Kingston FURY Beast 16GB DDR4-3200');
      jelzesVan('Memória <=> Alaplap', ['motherboards', 'ram']);
      kartya('Kingston FURY Beast 16GB DDR4-3200').should('have.class', 'conflict');

      kivalaszt('ram', 'Kingston FURY Beast 16GB DDR5-5200');
      nincsJelzes();
    });

    it('kompatibilis DDR4-es párosításnál sincs jelzés', () => {
      kivalaszt('motherboards', 'MSI PRO B760-P WIFI DDR4');
      kivalaszt('ram', 'Kingston FURY Beast 16GB DDR4-3200');
      nincsJelzes();
    });
  });

  describe('F10: kompatibilitás – hűtő, ház, tárhely, tápegység', () => {
    const TESZT_ADATOK = {
      processors: [
        { id: 1, name: 'Teszt CPU AM5', price: 100, socket: 'AM5', tdp: 100 },
      ],
      motherboards: [
        { id: 1, name: 'Teszt Alaplap ATX', price: 100, cpuSocket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', storageInterfaces: ['M.2 NVMe', 'SATA'] },
        { id: 2, name: 'Teszt Alaplap csak SATA', price: 100, cpuSocket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', storageInterfaces: ['SATA'] },
      ],
      ram: [
        { id: 1, name: 'Teszt RAM', price: 50, ramType: 'DDR5' },
      ],
      gpus: [
        { id: 1, name: 'Teszt GPU 190W', price: 300, tdp: 190 },
      ],
      storage: [
        { id: 1, name: 'Teszt NVMe SSD', price: 80, interface: 'M.2 NVMe' },
        { id: 2, name: 'Teszt SATA SSD', price: 70, interface: 'SATA' },
      ],
      powerSupplies: [
        { id: 1, name: 'Teszt PSU 349W', price: 100, wattage: 349 },
        { id: 2, name: 'Teszt PSU 350W', price: 100, wattage: 350 },
        { id: 3, name: 'Teszt PSU 351W', price: 100, wattage: 351 },
      ],
      cases: [
        { id: 1, name: 'Teszt Ház ATX', price: 90, supportedFormFactor: 'ATX' },
        { id: 2, name: 'Teszt Ház mATX', price: 90, supportedFormFactor: 'mATX' },
      ],
      cpuCoolers: [
        { id: 1, name: 'Teszt Hűtő AM5', price: 40, supportedSockets: ['AM5'] },
        { id: 2, name: 'Teszt Hűtő LGA1700', price: 40, supportedSockets: ['LGA1700'] },
      ],
    };

    beforeEach(() => {
      Object.keys(TESZT_ADATOK).forEach((kulcs) => {
        cy.intercept('GET', `**/api/${kulcs}`, {
          headers: { 'access-control-allow-origin': '*' },
          body: TESZT_ADATOK[kulcs],
        });
      });
      cy.visit('/');
      cy.get('#cards .card').should('have.length', 1);
    });

    it('hűtő – foglalat', () => {
      kivalaszt('processors', 'Teszt CPU AM5');

      kivalaszt('cpuCoolers', 'Teszt Hűtő AM5');
      nincsJelzes();

      kivalaszt('cpuCoolers', 'Teszt Hűtő LGA1700');
      jelzesVan('CPU hűtő <=> Processzor', ['cpuCoolers', 'processors']);
    });

    it('ház – alaplap formátum', () => {
      kivalaszt('motherboards', 'Teszt Alaplap ATX');

      kivalaszt('cases', 'Teszt Ház ATX');
      nincsJelzes();

      kivalaszt('cases', 'Teszt Ház mATX');
      jelzesVan('Ház <=> Alaplap', ['cases', 'motherboards']);
    });

    it('tárhely – alaplap interfész', () => {
      kivalaszt('motherboards', 'Teszt Alaplap csak SATA');

      kivalaszt('storage', 'Teszt SATA SSD');
      nincsJelzes();

      kivalaszt('storage', 'Teszt NVMe SSD');
      jelzesVan('Tárhely <=> Alaplap', ['storage', 'motherboards']);
    });

    it('tápegység – fogyasztás, a határérték még elfogadott', () => {
      kivalaszt('processors', 'Teszt CPU AM5');
      kivalaszt('gpus', 'Teszt GPU 190W');

      kivalaszt('powerSupplies', 'Teszt PSU 349W');
      jelzesVan('Tápegység <=> Fogyasztás', ['powerSupplies']);

      kivalaszt('powerSupplies', 'Teszt PSU 350W');
      nincsJelzes();

      kivalaszt('powerSupplies', 'Teszt PSU 351W');
      nincsJelzes();
    });
  });

  describe('Konfigurációk kezelése', () => {
    beforeEach(() => {
      konfigokTorlese();
    });

    after(() => {
      konfigokTorlese();
    });

    describe('F11: új konfiguráció mentése', () => {
      beforeEach(() => {
        cy.visit('/');
        cy.get('#cards .card').should('have.length', 10);
      });

      it('mentés után a gomb visszajelez, a névmező kiürül, és a mentett oldalon megjelenik', () => {
        kivalaszt('processors', 'AMD Ryzen 5 7600');
        kivalaszt('motherboards', 'MSI PRO B650-S WIFI');

        cy.get('#config-name').type('Gamer gép');
        cy.get('#save-config-btn').click();

        cy.get('#save-config-btn').should('have.text', 'Mentve! ✓');
        cy.get('#config-name').should('have.value', '');
        cy.get('#save-config-btn', { timeout: 4000 }).should('have.text', 'Konfiguráció mentése');

        cy.visit('/savedConfigs.html');
        cy.get('.saved-config-item').should('have.length', 1);
        cy.get('.config-name').should('have.text', 'Gamer gép');
        cy.get('.config-total').should('contain.text', '357');
      });

      it('név nélkül „Névtelen konfiguráció" néven mentődik', () => {
        kivalaszt('processors', 'AMD Ryzen 5 7600');
        mentes('');

        cy.visit('/savedConfigs.html');
        cy.get('.config-name').should('have.text', 'Névtelen konfiguráció');
      });
    });

    describe('F12: mentés azonos névvel', () => {
      it('nem jön létre duplikátum, a meglévő konfiguráció felülíródik', () => {
        cy.visit('/');
        cy.get('#cards .card').should('have.length', 10);

        kivalaszt('processors', 'AMD Ryzen 5 7600');
        mentes('Azonos név');

        kivalaszt('processors', 'AMD Ryzen 7 7700');
        kivalaszt('motherboards', 'MSI PRO B650-S WIFI');
        mentes('Azonos név');

        cy.visit('/savedConfigs.html');
        cy.get('.saved-config-item').should('have.length', 1);
        cy.get('.config-total').should('contain.text', '419');
      });
    });

    describe('F13: mentett konfiguráció betöltése', () => {
      it('a „Betöltés" gomb után az összeállító a mentett alkatrészeket mutatja', () => {
        cy.request('POST', `${API}/configurations`, {
          name: 'Betöltős teszt A',
          parts: { processors: { id: 1, name: 'AMD Ryzen 5 7600', price: 181 } },
        });
        cy.request('POST', `${API}/configurations`, {
          name: 'Betöltős teszt B',
          parts: {
            processors: { id: 7, name: 'Intel Core i5-13400F', price: 176 },
            motherboards: { id: 6, name: 'MSI PRO B760-P WIFI DDR4', price: 154 },
            storage: { id: 9, name: 'Samsung 870 EVO 1TB', price: 86 },
          },
        });

        cy.visit('/savedConfigs.html');
        cy.get('.saved-config-item').should('have.length', 2);

        cy.contains('.saved-config-item', 'Betöltős teszt B').find('.load-config-btn').click();

        cy.get('#config-name').should('have.value', 'Betöltős teszt B');

        cy.get('#summary-list .part-name').should('have.length', 3);
        cy.get('#summary-list').should('contain.text', 'Intel Core i5-13400F');
        cy.get('#summary-list').should('contain.text', 'MSI PRO B760-P WIFI DDR4');
        cy.get('#summary-list').should('contain.text', 'Samsung 870 EVO 1TB');
        vegosszeg(416);

        kartya('Intel Core i5-13400F').should('have.class', 'selected');
        kategoria('storage');
        kartya('Samsung 870 EVO 1TB').should('have.class', 'selected');
      });
    });

    describe('F14: mentett konfiguráció törlése', () => {
      it('„Mégse" esetén megmarad, „Törlés" után eltűnik, az utolsó után üres állapot jelenik meg', () => {
        cy.request('POST', `${API}/configurations`, { name: 'Törlős teszt 1', parts: {} });
        cy.request('POST', `${API}/configurations`, { name: 'Törlős teszt 2', parts: {} });
        cy.visit('/savedConfigs.html');
        cy.get('.saved-config-item').should('have.length', 2);

        cy.contains('.saved-config-item', 'Törlős teszt 1').find('.delete-config-btn').click();
        cy.get('#delete-modal').should('be.visible');
        cy.get('#cancel-delete-btn').click();
        cy.get('#delete-modal').should('not.be.visible');
        cy.get('.saved-config-item').should('have.length', 2);

        cy.contains('.saved-config-item', 'Törlős teszt 1').find('.delete-config-btn').click();
        cy.get('#submit-delete-btn').click();
        cy.get('.saved-config-item').should('have.length', 1);
        cy.contains('.saved-config-item', 'Törlős teszt 1').should('not.exist');

        cy.contains('.saved-config-item', 'Törlős teszt 2').find('.delete-config-btn').click();
        cy.get('#submit-delete-btn').click();
        cy.get('.saved-config-item').should('not.exist');
        cy.get('.empty-configs').should('contain.text', 'Nincsenek mentett konfigurációk.');
      });
    });
  });
});
