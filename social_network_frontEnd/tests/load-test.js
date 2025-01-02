
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 100, // Number of virtual users
  duration: '30s', // Test duration
};

export default function () {
  http.get('https://swep-website.zeabur.app/');
  sleep(1); // Pause between requests
}
export let thresholds = {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  };
  