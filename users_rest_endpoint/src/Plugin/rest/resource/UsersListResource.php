<?php

namespace Drupal\users_rest_endpoint\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;

/**
 * Provides a Demo Resource
 *
 * @RestResource(
 *   id = "users_list_resource",
 *   label = @Translation("User List resource"),
 *   uri_paths = {
 *     "canonical" = "/api/users_list"
 *   }
 * )
 */
class UsersListResource extends ResourceBase
{
  /**
   * Responds to entity GET requests.
   * @return \Drupal\rest\ResourceResponse
   */
  public function get()
  {
    drupal_flush_all_caches();
    $query = \Drupal::entityQuery('user');
    $uids = $query->execute();

    $response = Array();

    foreach ($uids as $key => $value) {
      $account = \Drupal\user\Entity\User::load($value);
      $name = $account->getDisplayName();
      $user = \Drupal\user\Entity\User::load($value);
      $roles = $user->getRoles();
      $uuid = $user->uuid();
      
      array_push($response, Array(
        "uid" => $key,
        "uuid" => $uuid,
        "username" => $name,
        "roles" => $roles
      ));

    }
    //$response = ['message' => 'Hello, this is a rest service'];
    return new ResourceResponse($response);
  }
}
