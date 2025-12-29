<?php $__env->startSection('title'); ?>
    List Tickets
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content-header'); ?>
    <h1>Tickets<small>View all of the tickets on the system.</small></h1>
    <ol class="breadcrumb">
        <li><a href="<?php echo e(route('admin.index')); ?>">Admin</a></li>
        <li class="active">Tickets</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
<div class="row">
    <div class="col-xs-12">
        <form action="<?php echo e(route('admin.tickets.index')); ?>" method="POST">
            <div class="box <?php if($enabled == 'true'): ?> box-success <?php else: ?> box-danger <?php endif; ?>">
                <div class="box-header with-border">
                    <i class="fa fa-ticket"></i> <h3 class="box-title">Ticket System <small>Toggle whether tickets can be used.</small></h3>
                </div>
                <div class="box-body">
                    <div class="row">
                        <div class="form-group col-md-4">
                            <label class="control-label">Allow ticket creation?</label>
                            <div>
                                <select name="enabled" class="form-control">
                                    <option <?php if($enabled == 'false'): ?> selected <?php endif; ?> value="false">Disabled</option>
                                    <option <?php if($enabled == 'true'): ?> selected <?php endif; ?> value="true">Enabled</option>
                                </select>
                                <p class="text-muted"><small>Determines whether people can create tickets via the client UI.</small></p>
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                                <label class="control-label">Maximum ticket amount</label>
                                <div>
                                    <input type="text" class="form-control" name="max" value="<?php echo e($max); ?>" />
                                    <p class="text-muted"><small>Set the maximum amount of tickets a user can create.</small></p>
                                </div>
                            </div>
                    </div>
                    <?php echo csrf_field(); ?>

                    <button type="submit" name="_method" value="POST" class="btn btn-default pull-right">Save Changes</button>
                </div>
            </div>
        </form>
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Ticket List</h3>
            </div>
            <div class="box-body table-responsive no-padding">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Client Email</th>
                            <th>Title</th>
                            <th>Created At</th>
                            <th></th>
                        </tr>
                        <?php $__currentLoopData = $tickets; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ticket): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr data-ticket="<?php echo e($ticket->id); ?>">
                                <td><a href="<?php echo e(route('admin.tickets.view', $ticket->id)); ?>"><?php echo e($ticket->id); ?></a></td>
                                <td><a href="<?php echo e(route('admin.users.view', $ticket->client_id)); ?>"><?php echo e($ticket->user->email ?? 'N/A'); ?></a></td>
                                <td style="
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    max-width: 32ch;
                                "><code title="<?php echo e($ticket->title); ?>"><?php echo e($ticket->title); ?></code></td>
                                <td><?php echo e($ticket->created_at->diffForHumans()); ?></td>
                                <td class="text-center">
                                    <?php if($ticket->status == 'pending'): ?>
                                        <span class="label label-warning">Pending</span>
                                    <?php elseif($ticket->status == 'in-progress'): ?>
                                        <span class="label label-primary">In Progress</span>
                                    <?php elseif($ticket->status == 'unresolved'): ?>
                                        <span class="label label-danger">Unresolved</span>
                                    <?php else: ?>
                                        <span class="label label-success">Resolved</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/jexactyl/resources/views/admin/tickets/index.blade.php ENDPATH**/ ?>