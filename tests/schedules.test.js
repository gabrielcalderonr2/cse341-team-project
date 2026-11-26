import {
  describe,
  expect,
  test
} from 'vitest';

import request from 'supertest';
import app from '../app.js';


describe('GET /api/trips/:id/schedules', () => {
  test('returns a successful JSON response', async () => {
    const response = await request(app)
      .get('/api/trips/alpine-panorama/schedules');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toBeInstanceOf(Array);
  });

  test('returns the schedules for an existing trip', async () => {
    const response = await request(app)
      .get('/api/trips/alpine-panorama/schedules');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          tripId: 'alpine-panorama',
          departureTime: '08:30',
          arrivalTime: '13:00'
        })
      ])
    );
  });

  test('returns schedules when the selected month is valid', async () => {
    const response = await request(app)
      .get('/api/trips/alpine-panorama/schedules?month=4');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test('returns an empty array when the trip does not operate in the selected month', async () => {
    const response = await request(app)
      .get('/api/trips/alpine-panorama/schedules?month=3');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('returns an empty array when the month is invalid', async () => {
    const response = await request(app)
      .get('/api/trips/alpine-panorama/schedules?month=13');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('returns an empty array when the trip does not exist', async () => {
    const response = await request(app)
      .get('/api/trips/non-existing-trip/schedules');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
