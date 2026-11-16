# Vite Confederation – Learning & Simulation Platform

## Zielsetzung

Aufbau einer Learning & Simulation Experience innerhalb der bestehenden Vite Confederation, in der Mitarbeiter Data Literacy und Data Science Skills anhand realitätsnaher Geschäftsszenarien entwickeln.

Mitarbeiter sollen bestehende Business-Prozesse und Anwendungen in einer geschützten Umgebung kennenlernen, Daten analysieren und fundierte Entscheidungen treffen können – ohne Zugriff auf produktive Daten oder Auswirkungen auf produktive Systeme.

Grundprinzip: **Bestehende Shell-Infrastruktur und UI-Bausteine wiederverwenden, Learning und Simulation von den produktiven Anwendungen und Daten entkoppeln.**

## Kurzfristig – MVP

Eine erste funktionsfähige Learning Experience als Pilot entwickeln.

- Learning MFE innerhalb der bestehenden Application Shell.
- Bestehende React Component Libraries aus der Application Platform konsumieren.
- Einen ersten Data-Literacy-Learning-Path implementieren.
- Einen eigenen Synthetic Data Generator entwickeln.
- Eine isolierte Simulation API mit eigener Datenhaltung aufbauen.
- Ein erstes Business-Szenario (z. B. Sales Analytics) mit Aufgaben, Datenanalyse und Entscheidungsfindung umsetzen.
- Lernfortschritt und grundlegende Evaluation ermöglichen.

**Ergebnis:** Eine erste interaktive Learning Experience, die den praktischen Nutzen des Konzepts demonstriert.

## Mittelfristig – Wiederverwendbarkeit

Die Architektur so erweitern, dass weitere Learning Paths ohne individuelle Learning-Versionen bestehender Apps entstehen können.

- Wiederverwendbare Business Capabilities aus bestehenden Anwendungen identifizieren und extrahieren.
- Klare Trennung zwischen UI Components, fachlichen Capabilities und Learning-Funktionalität.
- Standardisierte Data Contracts und Integration Interfaces etablieren.
- Scenario Engine und Learning Objectives verallgemeinern.
- Weitere synthetische Datensätze und Business-Szenarien entwickeln.
- Mehrere Capabilities und Anwendungen innerhalb eines Learning Paths kombinieren.

**Ergebnis:** Neue Trainings können auf bestehenden UI- und Business-Bausteinen aufbauen, statt Anwendungen zu duplizieren.

## Langfristig – Learning & Simulation Ecosystem

Ausbau zu einer skalierbaren Learning & Simulation Experience als integraler Bestandteil der Vite Confederation.

- Zentrale Verwaltung von Learning Paths, Szenarien und Kompetenzmodellen.
- Wiederverwendbare Capability Registry.
- Konfigurierbare Synthetic Data Generation und Business Simulations.
- Realitätsnahe Simulation von Geschäftsprozessen und Entscheidungsfolgen.
- Kompetenzorientierte Evaluation und Learning Analytics.
- Perspektivisch ein visueller Scenario Editor, über den Fachbereiche eigene Trainings erstellen können.

**Ergebnis:** Eine gemeinsame Plattform, die unterschiedliche Business-Anwendungen und Prozesse für individuelle, praxisorientierte Lernumgebungen nutzbar macht.

## Architekturprinzipien

1. **One Shell:** Nutzung der bestehenden Application Shell für Authentication, RBAC, Routing, Navigation und MFE Lifecycle. Keine zusätzliche Learning Shell.
2. **Separation of Concerns:** Learning Experience und Simulation Backend bleiben fachlich und technisch von den produktiven Anwendungen getrennt.
3. **No Learning Context in Business MFEs:** Bestehende MFEs müssen nichts über Learning oder Simulation wissen.
4. **Data Sovereignty:** Simulationen verwenden ausschließlich isolierte synthetische Daten und eigene Services.
5. **Reuse over Duplication:** Bestehende React Libraries und später extrahierte Business Capabilities werden wiederverwendet.
6. **Capability-oriented Learning:** Learning Paths orientieren sich an Kompetenzen und Geschäftsprozessen, nicht an einzelnen Anwendungen.
7. **Incremental Evolution:** Mit einem konkreten MVP starten und die Wiederverwendbarkeit schrittweise ausbauen.

## Zielarchitektur (vereinfacht)

- **Existing Application Shell:** Gemeinsame Infrastruktur für alle Experiences.
- **Production MFEs:** Bestehende produktive Anwendungen.
- **Learning MFE:** Learning Paths, Szenarien und Evaluation.
- **Shared Packages:** Wiederverwendbare React Components und Business Capabilities.
- **Production Backend:** Produktive APIs und Datenhaltung.
- **Simulation Backend:** Eigene APIs, Synthetic Data Generator und isolierte Datenhaltung.

Learning-spezifische Informationen wie Szenario, Simulations-ID und Lernfortschritt bleiben innerhalb der Learning Experience und ihrer Backend-Services.

---

**Strategische Leitidee:**

Nicht für jede Business-Anwendung eine eigene Learning-Version entwickeln, sondern eine gemeinsame Learning & Simulation Experience schaffen, die innerhalb der bestehenden Shell läuft und ausgewählte UI- und Business-Capabilities der Anwendungslandschaft wiederverwendet.