import { fireEvent, screen } from '@testing-library/react';
import { locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import type { EventHost, EventLocation } from '../../types/event';
import { EventPlaceAndHost } from './EventPlaceAndHost';

const text = locale.event_details.placeAndHost;

const location: EventLocation = {
  name: 'Livraria da Vila — Pinheiros',
  address: 'Rua Fradique Coutinho, 915 — São Paulo, SP',
};

const host: EventHost = {
  id: 'u1',
  name: 'Beatriz Souza',
  photoUrl: 'https://example.com/beatriz.jpg',
};

describe('EventPlaceAndHost', () => {
  describe('local', () => {
    it('mostra o nome e o endereço', () => {
      renderWithProviders(<EventPlaceAndHost location={location} host={host} />);
      expect(screen.getByText(location.name)).toBeInTheDocument();
      expect(screen.getByText(location.address as string)).toBeInTheDocument();
      expect(screen.queryByText(text.locationEmpty)).not.toBeInTheDocument();
    });

    it('avisa quando o local não tem endereço', () => {
      renderWithProviders(
        <EventPlaceAndHost location={{ ...location, address: null }} host={host} />,
      );

      expect(screen.getByText(location.name)).toBeInTheDocument();
      expect(screen.getByText(text.addressEmpty)).toBeInTheDocument();
    });

    it('mostra o estado vazio quando o evento não tem local', () => {
      renderWithProviders(<EventPlaceAndHost location={null} host={host} />);

      expect(screen.getByText(text.locationEmpty)).toBeInTheDocument();
      expect(screen.queryByText(text.addressEmpty)).not.toBeInTheDocument();
    });
  });

  describe('anfitriã', () => {
    it('mostra o nome com link para a participante', () => {
      renderWithProviders(<EventPlaceAndHost location={location} host={host} />);

      expect(screen.getByRole('link', { name: host.name })).toHaveAttribute(
        'href',
        `/participantes/${host.id}`,
      );
      expect(screen.queryByText(text.hostEmpty)).not.toBeInTheDocument();
    });

    it('mostra o estado vazio quando o evento não tem anfitriã', () => {
      renderWithProviders(<EventPlaceAndHost location={location} host={null} />);

      expect(screen.getByText(text.hostEmpty)).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('mostra a foto da anfitriã', () => {
      const { container } = renderWithProviders(
        <EventPlaceAndHost location={location} host={host} />,
      );

      expect(container.querySelector('img')).toHaveAttribute('src', host.photoUrl);
    });

    it('mostra o ícone padrão quando a anfitriã não tem foto', () => {
      const { container } = renderWithProviders(
        <EventPlaceAndHost location={location} host={{ ...host, photoUrl: null }} />,
      );

      expect(screen.getByRole('link', { name: host.name })).toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('troca a foto pelo ícone padrão quando ela não carrega', () => {
      const { container } = renderWithProviders(
        <EventPlaceAndHost location={location} host={host} />,
      );

      fireEvent.error(container.querySelector('img') as HTMLImageElement);

      expect(container.querySelector('img')).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: host.name })).toBeInTheDocument();
    });
  });
});
