import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s'
};

export default function() {
  const url = 'http://localhost:8080/server/ticket';
  const payload = JSON.stringify([
    {
      'event': {
        'id': '8b644f1f-bf40-4ae6-a303-d9e6dabd5c79'
      },
      'section': {
        'id': '95517b55-0a7a-478b-b6e6-80503345c6cc'
      },
      'customer': {
        'id': '55ee14a9-0254-4900-947b-2531d807f45d'
      },
      'holderFirstName': 'John',
      'holderLastName': 'Doe',
      'status': 'ACTIVE'
    }
  ]);

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };


  const res = http.post(url, payload, params);
  check(res, {
    'is status 200': (r) => r.status === 200
  });
}

