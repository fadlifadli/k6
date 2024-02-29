import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const failures = new Rate('failed_requests');

export const option = {
  vus: 100,
  duration: '10s',
  thresholds: {
    failed_requests: ['rate<=0'],
    http_req_duration: ['p(95)<500']
  }
}

export default function () {
  const result = http.get('https://devpay.garuda-indonesia.com/payment/test_booking');
  check(result, {
    'http response status code is 200': r => r.status === 200,
  });
  failures.add(result.status !==200);
}